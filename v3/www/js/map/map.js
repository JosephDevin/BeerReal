import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../../css/map/map.css';

import { getLinesCsv }          from '../stats/storage/csvHelper.js';
import { showFeedCard }         from '../home/menu/inspectBeer.js';
import { FeedItem }             from '../home/feedItem.js';
import { Filesystem, Directory } from '@capacitor/filesystem';
import {Capacitor} from "@capacitor/core";
import { Geolocation } from '@capacitor/geolocation';

// Default centre shown while geolocation resolves (Paris, France)
const DEFAULT_LAT = 48.8566;
const DEFAULT_LNG = 2.3522;

export async function render(container) {
    container.innerHTML = `
    <div id="page-map">
      <div id="map"></div>
      <button id="recalculateButton" aria-label="Recalculate position">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 425.96 425.96">
            <path d="M213.29,0h-0.61C139.11,0 79.27,59.83 79.27,133.36c0,48.2 21.95,111.82 65.25,189.08c32.1,57.28 64.65,101.15 64.97,101.59c0.91,1.22 2.33,1.93 3.85,1.93c0.04,0 0.09,0 0.13,-0c1.56,-0.04 3,-0.84 3.87,-2.14c0.32,-0.49 32.64,-49.29 64.52,-108.98c43.03,-80.56 64.85,-141.62 64.85,-181.48C346.69,59.83 286.85,0 213.29,0zM274.86,136.62c0,34.12 -27.76,61.88 -61.88,61.88c-34.12,0 -61.88,-27.76 -61.88,-61.88s27.76,-61.88 61.88,-61.88C247.1,74.74 274.86,102.5 274.86,136.62z" fill="currentColor"/>
        </svg>
      </button>
    </div>
  `;

    // Initialise the map immediately with a default view so tiles start
    // loading right away — don't wait for geolocation first.
    const map = L.map('map').setView([DEFAULT_LAT, DEFAULT_LNG], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Force Leaflet to recalculate container size in case the layout
    // wasn't fully settled when the map was constructed.
    setTimeout(() => map.invalidateSize(), 100);

    // Fetch user position and beer markers in parallel
    const [[lat, lng]] = await Promise.all([
        recalculatePosition(),
        loadBeers(map),
    ]);

    map.flyTo([lat, lng], 12.5, { duration: 0.8 });

    document.getElementById('recalculateButton')?.addEventListener('click', async () => {
        const [lat, lng] = await recalculatePosition();
        map.flyTo([lat, lng], 14, { duration: 0.5 });
    });
}


// ── LOAD BEERS ─────────────────────────────────────

async function loadBeers(map) {
    const beers = await getLinesCsv();
    if (!beers || beers.length === 0) return;

    for (const beer of beers) {
        const [lat, lng] = addNoiseToCoordinates(beer.Location[0], beer.Location[1]);

        const marker = L.marker([lat, lng], { icon: beerIcon() });

        marker.on('click', async () => {
            let imageUrl = '';
            if (beer.Picture) {
                try {
                    const { uri } = await Filesystem.getUri({
                        path: `pics/${beer.Picture}`,
                        directory: Directory.External,
                    });
                    imageUrl = Capacitor.convertFileSrc(uri);
                } catch (e) {
                    console.error('Failed to resolve image', e);
                }
            }
            showFeedCard(new FeedItem(imageUrl, beer));
        });

        marker.addTo(map);
    }
}


// ── HELPERS ───────────────────────────────────────────────────────────────────

export async function recalculatePosition() {
    try {
        if (Capacitor.isNativePlatform()) {
            await Geolocation.requestPermissions();
        }
        const { coords } = await Geolocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 10000,
        });
        return [coords.latitude, coords.longitude];
    } catch (e) {
        console.error('Location error:', e);
        return [DEFAULT_LAT, DEFAULT_LNG];
    }
}

function addNoiseToCoordinates(lat, lng) {
    const noise = () => (Math.random() - 0.5) * 0.0001;
    return [lat + noise(), lng + noise()];
}

function beerIcon() {
    return L.divIcon({
        className: '',
        html: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 256 256">

  <path fill="#FBB117" stroke="#000000" stroke-width="1"
    d="M129.75,13.34C120.62,13.34 111.19,16.49 102.45,18.87C95.85,20.67 88.82,22.33 82.16,23.67C80.17,24.07 75.26,23.8 73.31,24.77C68.27,27.29 63.86,34.08 60.77,40.27C59.6,42.6 58.6,46.86 56.71,48.75C52.46,53 48.55,60.32 46.75,65.72C44.22,73.3 43.16,82.86 39.74,89.7C38.81,91.56 37.47,96.98 38.63,99.29C41.56,105.14 40.63,114.57 45.27,119.21C45.82,119.76 45.27,123.51 45.27,124.38C45.27,126.78 46.24,133.46 47.85,135.08C53.3,140.52 55.62,150.6 59.29,157.95C61.03,161.42 63.24,164.99 64.46,168.65C64.99,170.25 67.49,172.65 68.51,174.18C72.78,180.57 77.72,187.79 80.69,193.73C86.06,204.47 95.7,209.42 102.45,219.56C104.86,223.17 109.67,226.81 110.94,230.62C111.92,233.56 113.6,236.61 115.36,238.37C118.11,241.11 125.28,240.95 129.38,240.95C130.77,240.95 137.21,241.84 138.98,240.95C140.7,240.09 142.77,239.61 144.51,238.74C148.34,236.82 147.88,231.31 150.41,228.78C151.42,227.77 153.15,225.87 154.1,223.98C155.22,221.74 156.04,217.25 157.79,215.5C161.61,211.68 162.92,204.1 166.64,200.37C169.95,197.06 172.92,191.32 176.23,186.35C177.11,185.04 179.55,182.4 179.55,180.82C179.55,179.54 178.91,178.79 179.55,177.5C181.52,173.57 186.29,169.92 188.41,165.7C188.97,164.58 191.73,162.47 191.73,161.27C191.73,159.3 194.54,152.55 196.15,150.94C196.79,150.31 195.42,154.42 195.42,153.52C195.42,150.04 199.93,145.3 200.95,141.72C201.91,138.35 201.78,134.8 202.8,131.76C203.22,130.48 203.67,129.07 203.9,127.7C203.96,127.33 203.9,126.22 203.9,126.59C203.9,126.98 203.53,128.09 203.53,127.7C203.53,126.47 203.53,125.24 203.53,124.01C203.53,123.64 203.53,122.53 203.53,122.9C203.53,123 206.93,117.59 207.59,116.26C208.35,114.74 207.92,112.01 208.33,110.36C211.31,98.43 207.41,85.84 203.9,75.31C203.02,72.66 204.25,64.96 202.43,63.14C201.22,61.94 201.68,60.17 200.95,58.71C199.02,54.85 197.28,49.56 196.15,45.06C195.85,43.82 195.79,38.05 195.05,37.32C192.36,34.63 187.88,33.4 184.35,31.05C178.77,27.33 175.15,25.34 169.59,22.56C164.67,20.1 162.5,14.28 155.95,12.97C150.19,11.82 145.35,14.44 140.45,14.44C135.77,14.44 132.74,14.07 127.91,14.07"/>

  <path fill="none" stroke="#020202" stroke-width="11.84"
    d="M166.41,78.01C166.42,82.11 164.11,85.9 160.36,87.95L160.36,83.79L129.77,83.79C126.49,83.94 123.87,86.42 123.71,89.52L123.71,98.13C124.3,104.79 117.05,109.55 110.66,106.71C107.19,105.16 105.1,101.74 105.42,98.13L105.42,89.52C105.46,86.34 102.73,83.76 99.37,83.79L87.32,83.79L87.32,87.95C83.45,85.98 81.01,82.17 80.95,78.01C80.99,71.54 86.61,66.36 93.44,66.49C93.44,60.16 98.85,55.02 105.55,54.98C107.98,54.99 110.36,55.69 112.37,56.97C115.43,48.65 126.87,46.57 132.97,53.24C133.97,54.33 134.75,55.6 135.25,56.97C137.28,55.71 139.64,55.02 142.07,54.98C148.78,55.02 154.21,60.15 154.24,66.49C160.95,66.53 166.38,71.66 166.41,78.01Z"/>

  <path fill="none" stroke="#020202" stroke-width="11.84"
    d="M160.36,83.79L160.36,164.3C160.36,170.66 154.91,175.81 148.19,175.81L99.5,175.81C92.77,175.81 87.32,170.66 87.32,164.3L87.32,83.79L99.5,83.79C102.86,83.76 105.59,86.34 105.55,89.52L105.55,98.13C104.96,104.79 112.22,109.55 118.61,106.71C122.07,105.16 124.16,101.74 123.84,98.13L123.84,89.52C124,86.46 126.54,84 129.77,83.79L160.36,83.79Z"/>

  <path fill="none" stroke="#020202" stroke-width="11.84"
    d="M160.36,101.03L172.47,101.03C179.19,101.03 184.64,106.18 184.64,112.54L184.64,135.56C184.64,141.91 179.19,147.07 172.47,147.07L160.36,147.07C160.36,147.07 160.36,147.07 160.36,147.07L160.36,101.03C160.36,101.03 160.36,101.03 160.36,101.03Z"/>

  <path fill="#000000"
    d="M127,0C74.62,0 32,42.84 32,95.5c0,78.46 85.54,155.07 89.19,158.29c1.66,1.47 3.74,2.21 5.81,2.21c2.08,0 4.15,-0.74 5.81,-2.21c3.64,-3.22 89.19,-79.83 89.19,-158.29C222,42.84 179.38,0 127,0zM127,235.04c-18.91,-18.42 -77.41,-80.19 -77.41,-139.54c0,-42.91 34.72,-77.82 77.41,-77.82s77.41,34.91 77.41,77.82C204.41,154.86 145.91,216.63 127,235.04z"/>

</svg>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
    });
}