const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/web-CjLmpT60.js","assets/dist-DVAlI8Z_.js"])))=>i.map(i=>d[i]);
import{a as e,c as t,o as n}from"./dist-DVAlI8Z_.js";import{i as r,n as i,r as a,t as o}from"./esm-QZTRPYcA.js";import{t as s}from"./definitions-BPUFIQlX.js";import{n as c,t as l}from"./preload-helper-DQdQJW1-.js";import{i as u,n as d,r as f,t as p}from"./strings-CpTbGbey.js";import{i as m}from"./index-DFCkgdhp.js";import{i as h,s as g}from"./csvHelper-C2bfiVxD.js";import{n as _,t as v}from"./achievementHandler-D5arN7dd.js";function y(e){let t=e.getLine(),n=t.Date?t.Date.slice(-5):``,r=E(t.Date);b();let i=document.createElement(`div`);i.id=`feed-card-overlay`,i.innerHTML=`
        <div class="fc-backdrop"></div>
        <div class="fc-card" role="dialog" aria-modal="true">

            <div class="fc-drag-handle"></div>

            <div class="fc-photo-wrapper">
                <img
                    class="fc-photo"
                    src="${T(e.getImageUrl())}"
                    alt="${T(t.Title)} photo"
                />
                <div class="fc-photo-scrim"></div>
                <span class="fc-pill">${T(t.Volume)}L</span>
                <span class="fc-date-pill">${T(r)}</span>
                <button class="fc-close" aria-label="Close">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" stroke-width="2.5"
                         stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
            </div>

            <div class="fc-body">
                <div class="fc-row-top">
                    <div class="fc-name-group">
                        <p class="fc-brand">${T(t.Brand)}</p>
                        <p class="fc-bar">${T(t.Bar)}</p>
                    </div>
                    <div class="fc-price-group">
                        <p class="fc-price">${T(t.Price.toFixed(2))}€</p>
                        <p class="fc-hour">${T(n)}</p>
                    </div>
                </div>

                <div class="fc-divider"></div>

                <div class="fc-row-bottom">
                    <div class="fc-stars" data-rating="${T(t.Rating)}"></div>
                    <div class="fc-actions">
                        <button class="fc-btn-edit" data-path="${T(t.Picture)}">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor" stroke-width="2.2"
                                 stroke-linecap="round" stroke-linejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                        </button>
                        <button class="fc-btn-delete" data-path="${T(t.Picture)}">${d.delete}</button>
                    </div>
                </div>
            </div>

        </div>
    `,document.body.appendChild(i),D(i.querySelector(`.fc-stars`),parseFloat(t.Rating)),requestAnimationFrame(()=>i.classList.add(`fc-visible`)),i.querySelector(`.fc-backdrop`).addEventListener(`click`,b),i.querySelector(`.fc-close`).addEventListener(`click`,b),document.addEventListener(`keydown`,w),i.querySelector(`.fc-btn-edit`).addEventListener(`click`,()=>{b(),document.dispatchEvent(new CustomEvent(`feedcard:edit`,{detail:{line:t}}))}),C(i.querySelector(`.fc-card`),b),i.querySelector(`.fc-btn-delete`).addEventListener(`click`,()=>{x(t,()=>{b()})})}function b(){let e=document.getElementById(`feed-card-overlay`);e&&(e.classList.remove(`fc-visible`),e.addEventListener(`transitionend`,()=>e.remove(),{once:!0}),document.removeEventListener(`keydown`,w))}function x(e,t){let n=document.getElementById(`fc-delete-confirm`);n&&n.remove();let r=document.createElement(`div`);r.id=`fc-delete-confirm`,r.style.cssText=`
        position: fixed; inset: 0; z-index: 99999;
        display: flex; align-items: center; justify-content: center;
    `;let i=document.createElement(`div`);i.style.cssText=`
        position: absolute; inset: 0;
        background: rgba(0,0,0,0.6); backdrop-filter: blur(2px);
    `;let a=document.createElement(`div`);a.style.cssText=`
        position: relative; background: #1e1e1e; border-radius: 16px;
        padding: 24px; width: min(320px, 85vw); text-align: center;
        box-shadow: 0 8px 32px rgba(0,0,0,0.5);
    `,a.innerHTML=`
        <p style="margin:0 0 6px; font-size:17px; font-weight:600; color:#fff;">
            ${d.confirm_title}
        </p>
        <p style="margin:0 0 20px; font-size:14px; color:rgba(255,255,255,0.55);">
            ${d.confirm_subtitle}
        </p>
        <div style="display:flex; gap:10px;">
            <button id="fc-cancel-btn" style="
                flex:1; padding:12px; border-radius:10px; border:none;
                background:rgba(255,255,255,0.1); color:#fff; font-size:15px; cursor:pointer;">
                ${d.cancel}
            </button>
            <button id="fc-delete-btn" style="
                flex:1; padding:12px; border-radius:10px; border:none;
                background:#EFAB27; color:#000; font-size:15px;
                font-weight:600; cursor:pointer;">${d.delete}</button>
        </div>
    `,r.appendChild(i),r.appendChild(a),document.body.appendChild(r);let o=()=>r.remove();i.addEventListener(`click`,o),a.querySelector(`#fc-cancel-btn`).addEventListener(`click`,o),a.querySelector(`#fc-delete-btn`).addEventListener(`click`,async()=>{await S(e),o(),t(),document.dispatchEvent(new CustomEvent(`feedcard:deleted`))})}async function S(e){if(await g(e.Picture),await f.init(),await f.resyncBrand(e.Brand),e.Picture)try{await o.deleteFile({path:`pics/${e.Picture}`,directory:s.External}),v(!0).catch(console.error)}catch(e){console.error(`Failed to delete image file:`,e)}}function C(e,t){let n=0,r=!1;e.addEventListener(`touchstart`,e=>{n=e.touches[0].clientY,r=!1},{passive:!0}),e.addEventListener(`touchmove`,t=>{let i=t.touches[0].clientY-n;i>0&&(r=!0,e.style.transform=`translateY(${i}px)`,e.style.transition=`none`)},{passive:!0}),e.addEventListener(`touchend`,i=>{let a=i.changedTouches[0].clientY-n;r&&a>80?(e.style.transition=`transform 0.2s ease`,e.style.transform=`translateY(${window.innerHeight}px)`,setTimeout(t,200)):(e.style.transition=``,e.style.transform=``),r=!1},{passive:!0})}function w(e){e.key===`Escape`&&b()}function T(e){return String(e??``).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}function E(e){if(!e)return``;let t=e.trim().split(`-`);return t.length<3?``:`${t[2]}-${t[1]}`}function D(e,t){for(let n=1;n<=5;n++){let r=n<=Math.floor(t)?`#EFAB27`:n===Math.ceil(t)&&t%1>=.5?`url(#fc-half)`:`rgba(255,255,255,0.15)`,i=document.createElementNS(`http://www.w3.org/2000/svg`,`svg`);i.setAttribute(`width`,`20`),i.setAttribute(`height`,`20`),i.setAttribute(`viewBox`,`0 0 24 24`),i.innerHTML=`
            <defs>
                <linearGradient id="fc-half">
                    <stop offset="50%" stop-color="#EFAB27"/>
                    <stop offset="50%" stop-color="rgba(255,255,255,0.15)"/>
                </linearGradient>
            </defs>
            <polygon
                points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                fill="${r}"
                stroke="#EFAB27"
                stroke-width="1.5"
                stroke-linejoin="round"
            />`,e.appendChild(i)}}function O(){return!!document.getElementById(`feed-card-overlay`)}var k=t((()=>{m(),h(),i(),p(),_(),u()})),A=t((()=>{})),j,M=t((()=>{A(),j=class{constructor(e,t){this.imageUrl=e,this.line=t}getImageUrl(){return this.imageUrl}getLine(){return this.line}}})),N=t((()=>{})),P,F=t((()=>{e(),r(),N(),c(),P=n(`Geolocation`,{web:()=>l(()=>import(`./web-CjLmpT60.js`).then(e=>new e.GeolocationWeb),__vite__mapDeps([0,1]))}),a()}));export{A as a,b as c,M as i,y as l,F as n,k as o,j as r,O as s,P as t};