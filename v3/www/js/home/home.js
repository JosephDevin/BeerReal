import {isFeedCardOpen, removeFeedCard, showFeedCard} from './menu/inspectBeer.js';
import { createImageDir, getLinesCsv, initialiseCSV } from '../stats/storage/csvHelper.js';
import { FeedItem }     from './feedItem.js';
import { openBeerMenu, openEditBeerMenu } from "./menu/beerMenu"; // ← add openEditBeerMenu

import { t }            from '../../assets/strings/strings.js';

import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor }             from '@capacitor/core';
import { CameraPreview }         from '@capacitor-community/camera-preview';
import { Geolocation }           from '@capacitor/geolocation';
import { App } from '@capacitor/app';

import '../../css/home/home.css';
import '../../css/home/beerCard.css';
import '../../css/home/beerMenu.css';


// ── MODULE-LEVEL STATE ────────────────────────────────────────────────────────
// Kept here so the document listeners below are registered exactly once,
// even if render() is called multiple times (e.g. HMR, route re-entry).

let _feed    = null;
let _welcome = null;

function onFeedCardEdit(e) {
    openEditBeerMenu(e.detail.line, () => loadFeed(_feed, _welcome), () => {});
}

function onFeedCardDeleted() {
    loadFeed(_feed, _welcome);
}

document.addEventListener('feedcard:edit',    onFeedCardEdit);
document.addEventListener('feedcard:deleted', onFeedCardDeleted);

// HMR cleanup — removes the listeners before the old module is discarded,
// preventing accumulation across hot reloads during development.
if (import.meta.hot) {
    import.meta.hot.dispose(() => {
        document.removeEventListener('feedcard:edit',    onFeedCardEdit);
        document.removeEventListener('feedcard:deleted', onFeedCardDeleted);
    });
}


// ── RENDER ────────────────────────────────────────────────────────────────────

export function render(container) {
    container.innerHTML = `
    <div id="page-home">

      <div id="previewView">
        <span class="camera-placeholder"></span>
      </div>

      <div id="topBar">
        <span>BeerReal.</span>
      </div>

      <button id="exitButton" aria-label="Close camera">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
      </button>

      <div id="feedRecyclerView"></div>

      <div id="welcomeText" class="hidden">
        <h2>${t.welcome}</h2>
        <p>${t.welcome_sub}</p>
      </div>

      <button id="captureButton" aria-label="Capture">
        <div class="inner"></div>
      </button>

      <button id="addButton" aria-label="Add a beer photo">
        <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24">
          <path fill="currentColor" d="M3,4V1h2v3h3v2H5v3H3V6H0V4H3zM6,10V7h3V4h7l1.83,2H21c1.1,0 2,0.9 2,2v12c0,1.1 -0.9,2 -2,2H5c-1.1,0 -2,-0.9 -2,-2V10H6zM13,19c2.76,0 5,-2.24 5,-5s-2.24,-5 -5,-5s-5,2.24 -5,5S10.24,19 13,19zM9.8,14c0,1.77 1.43,3.2 3.2,3.2s3.2,-1.43 3.2,-3.2s-1.43,-3.2 -3.2,-3.2S9.8,12.23 9.8,14z"/>
        </svg>
      </button>

    </div>
  `;

    initHome();
}


// ── INIT ──────────────────────────────────────────────────────────────────────

async function initHome() {
    const page       = document.getElementById('page-home');
    const feed       = document.getElementById('feedRecyclerView');
    const welcome    = document.getElementById('welcomeText');
    const addBtn     = document.getElementById('addButton');
    const exitBtn    = document.getElementById('exitButton');
    const captureBtn = document.getElementById('captureButton');
    const preview    = document.getElementById('previewView');

    // Update module-level refs so the document listeners always target
    // the freshest DOM nodes after a re-render.
    _feed    = feed;
    _welcome = welcome;

    // Request location early (needed for recording beer coordinates).
    // Camera permission is deferred to when the user actually taps the
    // camera button so it never blocks the feed from appearing.
    await requestLocationPermission();
    await initialiseCSV();
    await createImageDir();

    await loadFeed(feed, welcome);

    addBtn.addEventListener('click', async () => {
        // Request camera permission on first tap — avoids crashing on
        // iOS if Info.plist keys were somehow missing from a prior build.
        await requestCameraPermission();
        page.classList.add('camera-active');
        addBtn.style.display = 'none';
        await startCamera();
    });

    preview.addEventListener('click', async (e) => {
        if (e.target.closest('#captureButton') || e.target.closest('#exitButton')) return;
        await toggleCamera();
    });

    exitBtn.addEventListener('click', async () => {
        await destroyCamera(page, addBtn);
    });

    captureBtn.addEventListener('click', async () => {
        await capturePhoto(page, addBtn, feed, welcome);
    });
}


// ── PERMISSIONS ───────────────────────────────────────────────────────────────

async function requestCameraPermission() {
    if (!Capacitor.isNativePlatform()) return;
    try {
        const { Camera } = await import('@capacitor/camera');
        await Camera.requestPermissions({ permissions: ['camera'] });
    } catch (e) {
        console.error('Failed to request camera permission:', e);
    }
}

async function requestLocationPermission() {
    if (!Capacitor.isNativePlatform()) return;
    try {
        await Geolocation.requestPermissions();
    } catch (e) {
        console.error('Failed to request location permission:', e);
    }
}


// ── GEOLOCATION ───────────────────────────────────────────────────────────────

async function getCurrentCoords() {
    try {
        const { coords } = await Geolocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 10000,
        });
        return [coords.latitude, coords.longitude];
    } catch (e) {
        console.error('Location error:', e);
        showToast(t.location_error ?? 'Location unavailable');
        return [0, 0];
    }
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%);
        background: rgba(0,0,0,0.75); color: #fff; padding: 8px 16px;
        border-radius: 20px; font-size: 13px; z-index: 9999;
        pointer-events: none; white-space: nowrap;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}


// ── CAMERA ────────────────────────────────────────────────────────────────────

let cameraActive = false;
let cameraFacing = 'rear';

async function startCamera() {
    try {
        await CameraPreview.start({
            position: cameraFacing,
            parent:   'previewView',
            toBack:   true,
            width:    window.innerWidth,
            height:   window.innerHeight,
        });
        cameraActive = true;
    } catch (e) {
        console.error('Failed to start camera:', JSON.stringify(e));
    }
}

async function destroyCamera(page, addBtn) {
    if (!cameraActive) return;
    try {
        await CameraPreview.stop();
    } catch (e) {
        console.error('Failed to stop camera:', JSON.stringify(e));
    }
    cameraActive = false;
    page.classList.remove('camera-active');
    addBtn.style.display = 'flex';
}

async function toggleCamera() {
    cameraFacing = (cameraFacing === 'rear') ? 'front' : 'rear';
    try {
        await CameraPreview.flip();
    } catch (e) {
        console.error('Failed to flip camera:', JSON.stringify(e));
    }
}

async function capturePhoto(page, addBtn, feed, welcome) {
    if (!cameraActive) return;

    let filename = null;

    try {
        const { value: base64 } = await CameraPreview.capture({ quality: 90 });

        const now   = new Date();
        const pad   = (n) => String(n).padStart(2, '0');
        const stamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`
            + `_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
        filename = `photo_${stamp}.jpg`;

        // ⚡ Start fetching coords immediately — don't await
        const coordsPromise = getCurrentCoords();

        await Filesystem.writeFile({
            path:      `pics/${filename}`,
            data:      base64,
            directory: Directory.External,
            recursive: true,
        });

        console.log('Photo saved:', filename);

        await destroyCamera(page, addBtn);
        await new Promise(r => setTimeout(r, 150));

        openBeerMenu(filename, coordsPromise, () => loadFeed(feed, welcome), () => {});

    } catch (e) {
        console.error('Failed to capture or save photo:', JSON.stringify(e));
        showToast('Failed to save photo. Please try again.');
    }
}


// ── FEED LOADER ───────────────────────────────────────────────────────────────

const EAGER_LOAD_COUNT = 10;

async function loadFeed(feed, welcome) {
    let beers;
    try {
        beers = await getLinesCsv();
    } catch (e) {
        console.error('loadFeed: failed to read CSV:', e);
        welcome.classList.remove('hidden');
        return;
    }

    if (beers.length === 0) {
        welcome.classList.remove('hidden');
        return;
    }

    welcome.classList.add('hidden');
    feed.innerHTML = '';

    const reversed = beers.reverse();

    const pairs = reversed.map((beer, index) => {
        const feedItem = new FeedItem('', beer);
        const card     = bindFeedItem(feedItem);

        if (index >= EAGER_LOAD_COUNT) {
            card.classList.add('bc-lazy');
        }

        feed.appendChild(card);
        return { beer, feedItem, card, index };
    });

    // ── Eager pass ────────────────────────────────────────────────────────────
    const eagerPairs = pairs.slice(0, EAGER_LOAD_COUNT);
    await Promise.all(eagerPairs.map(({ beer, card, feedItem }) => resolveAndInjectImage(beer, card, feedItem)));

    // ── Lazy pass ─────────────────────────────────────────────────────────────
    const lazyPairs = pairs.slice(EAGER_LOAD_COUNT);
    if (lazyPairs.length === 0) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                const card = entry.target;
                observer.unobserve(card);

                const match = lazyPairs.find(p => p.card === card);
                if (!match) return;

                resolveAndInjectImage(match.beer, match.card, match.feedItem).then(() => {
                    requestAnimationFrame(() => card.classList.add('bc-lazy--visible'));
                });
            });
        },
        { rootMargin: '0px 0px 120px 0px', threshold: 0 },
    );

    lazyPairs.forEach(({ card }) => observer.observe(card));
}


// ── IMAGE RESOLVER ────────────────────────────────────────────────────────────

async function resolveAndInjectImage(beer, card, feedItem) {
    if (!beer.Picture) return;

    try {
        const result    = await Filesystem.getUri({ path: `pics/${beer.Picture}`, directory: Directory.External });
        const converted = Capacitor.convertFileSrc(result.uri);

        if (feedItem) feedItem.getImageUrl = () => converted;

        const wrapper     = card.querySelector('.bc-photo-wrapper');
        const placeholder = wrapper.querySelector('.bc-photo-placeholder');

        const img = document.createElement('img');
        img.className = 'bc-photo';
        img.alt       = card.querySelector('.bc-title')?.textContent ?? '';
        img.src       = converted;

        img.addEventListener('load',  () => { placeholder?.remove(); wrapper.insertBefore(img, wrapper.firstChild); }, { once: true });
        img.addEventListener('error', () => { console.error('Image failed to load:', converted); },                    { once: true });

    } catch (e) {
        console.error('Failed to resolve image URI:', JSON.stringify(e));
    }
}


// ── FEED ITEM BINDER ──────────────────────────────────────────────────────────

function bindFeedItem(feedItem) {
    const beer  = feedItem.getLine();
    const title = beer.Title;
    const date  = `${beer.Date.slice(8, 10)}-${beer.Date.slice(5, 7)}`;

    const card = document.createElement('div');
    card.className = 'beer-card';
    card.innerHTML = `
        <div class="bc-photo-wrapper">
            <div class="bc-photo-placeholder"></div>
            <div class="bc-scrim"></div>
            <span class="bc-title">${escHtml(title)}</span>
            <span class="bc-date">${escHtml(date)}</span>
        </div>
    `;

    card.addEventListener('click', () => showFeedCard(feedItem));
    return card;
}


// ── UTILS ─────────────────────────────────────────────────────────────────────

function escHtml(str) {
    return String(str ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// ── Android/iOS back button ──────────────────
App.addListener('backButton', () => {
    if (isFeedCardOpen()) {
        removeFeedCard();
    }
});