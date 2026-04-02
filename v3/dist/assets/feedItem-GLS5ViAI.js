import{n as e}from"./chunk-CZOpNEXY.js";import{r as t}from"./index-Cvr2Ijwj.js";import{n,t as r}from"./esm-DFLX2NAh.js";import{t as i}from"./definitions-DoEJ7x20.js";import{i as a,s as o}from"./csvHelper-Cys56eP6.js";import{n as s,t as c}from"./strings-DayaT0Cw.js";function l(e){let t=e.getLine(),n=t.date?t.date.slice(-5):``;u();let r=document.createElement(`div`);r.id=`feed-card-overlay`,r.innerHTML=`
        <div class="fc-backdrop"></div>
        <div class="fc-card" role="dialog" aria-modal="true">

            <div class="fc-photo-wrapper">
                <img
                    class="fc-photo"
                    src="${m(e.getImageUrl())}"
                    alt="${m(t.Title)} photo"
                />
                <div class="fc-photo-scrim"></div>
                <span class="fc-pill">${m(t.Volume)}L</span>
                <span class="fc-hour">${m(n)}</span>
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
                        <p class="fc-brand">${m(t.Brand)}</p>
                        <p class="fc-bar">${m(t.Bar)}</p>
                    </div>
                    <p class="fc-price">${m(t.Price.toFixed(2))}€</p>
                </div>

                <div class="fc-divider"></div>

                <div class="fc-row-bottom">
                    <div class="fc-stars" data-rating="${m(t.Rating)}"></div>
                    <div class="fc-actions">
                        <button class="fc-btn-edit" data-path="${m(t.Picture)}">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor" stroke-width="2.2"
                                 stroke-linecap="round" stroke-linejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                        </button>
                        <button class="fc-btn-delete" data-path="${m(t.Picture)}">Delete</button>
                    </div>
                </div>
            </div>

        </div>
    `,document.body.appendChild(r),h(r.querySelector(`.fc-stars`),parseFloat(t.Rating)),requestAnimationFrame(()=>r.classList.add(`fc-visible`)),r.querySelector(`.fc-backdrop`).addEventListener(`click`,u),r.querySelector(`.fc-close`).addEventListener(`click`,u),document.addEventListener(`keydown`,p),r.querySelector(`.fc-btn-edit`).addEventListener(`click`,()=>{u(),document.dispatchEvent(new CustomEvent(`feedcard:edit`,{detail:{line:t}}))}),r.querySelector(`.fc-btn-delete`).addEventListener(`click`,()=>{d(t.Picture,()=>{u()})})}function u(){let e=document.getElementById(`feed-card-overlay`);e&&(e.classList.remove(`fc-visible`),e.addEventListener(`transitionend`,()=>e.remove(),{once:!0}),document.removeEventListener(`keydown`,p))}function d(e,t){let n=document.getElementById(`fc-delete-confirm`);n&&n.remove();let r=document.createElement(`div`);r.id=`fc-delete-confirm`,r.style.cssText=`
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
            ${s.confirm_title??`Delete beer?`}
        </p>
        <p style="margin:0 0 20px; font-size:14px; color:rgba(255,255,255,0.55);">
            ${s.confirm_subtitle??`This cannot be undone.`}
        </p>
        <div style="display:flex; gap:10px;">
            <button id="fc-cancel-btn" style="
                flex:1; padding:12px; border-radius:10px; border:none;
                background:rgba(255,255,255,0.1); color:#fff; font-size:15px; cursor:pointer;">
                ${s.confirm_cancel}
            </button>
            <button id="fc-delete-btn" style="
                flex:1; padding:12px; border-radius:10px; border:none;
                background:#EFAB27; color:#000; font-size:15px;
                font-weight:600; cursor:pointer;">${s.confirm_delete}</button>
        </div>
    `,r.appendChild(i),r.appendChild(a),document.body.appendChild(r);let o=()=>r.remove();i.addEventListener(`click`,o),a.querySelector(`#fc-cancel-btn`).addEventListener(`click`,o),a.querySelector(`#fc-delete-btn`).addEventListener(`click`,async()=>{await f(e),o(),t(),document.dispatchEvent(new CustomEvent(`feedcard:deleted`))})}async function f(e){if(await o(e),e)try{await r.deleteFile({path:`pics/${e}`,directory:i.External})}catch(e){console.error(`Failed to delete image file:`,e)}}function p(e){e.key===`Escape`&&u()}function m(e){return String(e??``).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}function h(e,t){for(let n=1;n<=5;n++){let r=n<=Math.floor(t)?`#EFAB27`:n===Math.ceil(t)&&t%1>=.5?`url(#fc-half)`:`rgba(255,255,255,0.15)`,i=document.createElementNS(`http://www.w3.org/2000/svg`,`svg`);i.setAttribute(`width`,`20`),i.setAttribute(`height`,`20`),i.setAttribute(`viewBox`,`0 0 24 24`),i.innerHTML=`
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
            />`,e.appendChild(i)}}var g=e((()=>{t(),a(),n(),c()})),_=e((()=>{})),v,y=e((()=>{_(),v=class{constructor(e,t){this.imageUrl=e,this.line=t}getImageUrl(){return this.imageUrl}getLine(){return this.line}}}));export{l as a,g as i,y as n,_ as r,v as t};