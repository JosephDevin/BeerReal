const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/esm-CfyytdUV.js","assets/definitions-BPUFIQlX.js","assets/dist-DVAlI8Z_.js","assets/esm-QZTRPYcA.js","assets/preload-helper-DQdQJW1-.js","assets/web-D-xz2FZk.js","assets/web-DwB7M3SQ.js","assets/esm-BVQEPyer.js"])))=>i.map(i=>d[i]);
import{a as e,c as t,o as n,t as r}from"./dist-DVAlI8Z_.js";import{n as i,t as a}from"./esm-QZTRPYcA.js";import{t as o}from"./definitions-BPUFIQlX.js";import{n as s,t as c}from"./preload-helper-DQdQJW1-.js";import{i as l,n as u,r as d,t as f}from"./strings-CpTbGbey.js";import{a as p,c as m,i as h,n as g,r as _,t as ee}from"./csvHelper-C2bfiVxD.js";import{n as v,t as y}from"./achievementHandler-D5arN7dd.js";import{a as te,c as b,i as ne,l as x,n as re,o as ie,r as ae,s as S,t as C}from"./esm-Bv9ujMNZ.js";function w(e,t,n,r){T({filename:e,coordsPromise:t,existingLine:null,onSubmit:n,onCancel:r})}function oe(e,t,n){T({filename:e.Picture,coordsPromise:null,existingLine:e,onSubmit:t,onCancel:n})}function T({filename:e,coordsPromise:t,existingLine:n,onSubmit:r,onCancel:i}){let a=n!==null,o=document.createElement(`div`);o.className=`bm-backdrop`;let s=document.createElement(`div`);s.className=`bm-dialog`,s.setAttribute(`role`,`dialog`),s.setAttribute(`aria-modal`,`true`),s.setAttribute(`aria-label`,a?u.edit_title:u.beer_information);let l=document.createElement(`h2`);l.className=`bm-title`,l.textContent=a?u.edit_title:u.beer_information;let f=document.createElement(`div`);f.className=`bm-body`;let p=se(a?n:null);f.appendChild(p.form);let h=document.createElement(`div`);h.className=`bm-btn-row`;let g=document.createElement(`button`);g.className=`bm-btn bm-btn--cancel`,g.textContent=u.cancel;let _=document.createElement(`button`);_.className=`bm-btn bm-btn--submit`,_.textContent=a?u.update:u.submit,h.appendChild(g),h.appendChild(_),s.appendChild(l),s.appendChild(f),s.appendChild(h),o.appendChild(s),document.body.appendChild(o),requestAnimationFrame(()=>requestAnimationFrame(()=>o.classList.add(`bm-backdrop--visible`)));function v(){o.classList.remove(`bm-backdrop--visible`),o.addEventListener(`transitionend`,()=>o.remove(),{once:!0})}g.addEventListener(`click`,()=>{v(),i?.()}),_.addEventListener(`click`,async()=>{_.disabled=!0;let{title:o,brand:s,bar:l,volume:f,price:h,rating:g,error:y}=ce(p);if(y){j(y),_.disabled=!1;return}if(a){let e=n.Brand,t=k(s)!==k(e);await m(n.Picture,o,s,f,h,g,l),await d.init(),t&&await d.handleBrandRename(e,s,n.Picture),v(),r?.({...n,Title:o,Brand:s,Volume:f,Price:h,Rating:g,Bar:l}),E()}else{_.textContent=u.locating;let[n,a]=await t;if(n===0&&a===0){j(u.error_location);try{let{Filesystem:t,Directory:n}=await c(async()=>{let{Filesystem:e,Directory:t}=await import(`./esm-CfyytdUV.js`);return{Filesystem:e,Directory:t}},__vite__mapDeps([0,1,2,3,4]));await t.deleteFile({path:`pics/${e}`,directory:n.External})}catch{}v(),i?.();return}let p=await ee(e,o,s,f,h,[n,a],new Date,g,l);await d.init(),d.hasBrand(s)?(await d.addOrUpdateBrand(s,e),v(),r?.(p),E()):(v(),r?.(p),E(),A(s,async()=>{await d.addOrUpdateBrand(s,e)}))}})}async function E(){try{let e=await y(!1);if(e.length===0)return;for(let t=0;t<e.length;t++)setTimeout(()=>{j(u.achievement_unlocked+e[t])},t*600)}catch(e){console.error(`Achievement check failed:`,e)}}function se(e){let t=document.createElement(`div`);t.className=`bm-form`;let n=D(`text`,u.beer_title,e?.Title??``),r=D(`text`,u.beer_brand,e?.Brand??``),i=D(`number`,u.beer_volume,e?.Volume==null?``:String(e.Volume)),a=D(`number`,u.beer_price,e?.Price==null?``:String(e.Price)),o=D(`text`,u.beer_bar,e?.Bar??``),s=document.createElement(`p`);s.className=`bm-rating-label`,s.textContent=u.beer_rating;let{wrapper:c,getValue:l,setValue:d}=le(5,.5);return d(e?.Rating??2.5),t.appendChild(n.wrap),t.appendChild(r.wrap),t.appendChild(i.wrap),t.appendChild(a.wrap),t.appendChild(o.wrap),t.appendChild(s),t.appendChild(c),{form:t,titleInput:n,brandInput:r,volumeInput:i,priceInput:a,barInput:o,getRating:l}}function ce({titleInput:e,brandInput:t,volumeInput:n,priceInput:r,barInput:i,getRating:a}){let o=e.el.value.trim()||`Unknown Title`,s=t.el.value.trim()||`Unknown Brand`,c=i.el.value.trim()||`Unknown Bar`;for(let[e,t]of[[`Title`,o],[`Brand`,s],[`Bar`,c]])if(t.includes(`,`)||t.length>30)return{error:`${u.error_chars}`};return{title:o,brand:s,bar:c,volume:O(n.el.value,0),price:O(r.el.value,0),rating:a(),error:null}}function le(e,t){let n=0,r=document.createElement(`div`);r.className=`bm-stars`,r.setAttribute(`role`,`radiogroup`),r.setAttribute(`aria-label`,`Rating`);let i=[];for(let t=1;t<=e;t++){let e=document.createElement(`span`);e.className=`bm-star`,e.setAttribute(`aria-label`,`${t} star${t>1?`s`:``}`);let n=a(`rgba(255,255,255,0.3)`);n.setAttribute(`class`,`bm-star__empty`);let s=document.createElement(`span`);s.className=`bm-star__filled`,s.appendChild(a(`#FBB122`)),[`left`,`right`].forEach(n=>{let r=document.createElement(`span`);r.className=`bm-star__half bm-star__half--${n}`,r.dataset.value=n===`left`?t-.5:t,r.addEventListener(`click`,()=>o(parseFloat(r.dataset.value))),e.appendChild(r)}),e.appendChild(n),e.appendChild(s),r.appendChild(e),i.push(e)}function a(e){let t=document.createElementNS(`http://www.w3.org/2000/svg`,`svg`);return t.setAttribute(`viewBox`,`0 0 24 24`),t.innerHTML=`<path fill="${e}" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>`,t}function o(r){n=Math.round(r/t)*t,n=Math.max(0,Math.min(e,n)),ue(i,n)}function s(){return n}return o(2.5),{wrapper:r,getValue:s,setValue:o}}function ue(e,t){e.forEach((e,n)=>{let r=n+1;t>=r?e.dataset.fill=`full`:t>=r-.5?e.dataset.fill=`half`:e.dataset.fill=`empty`})}function D(e,t,n){let r=document.createElement(`div`);r.className=`bm-input-wrap`;let i=document.createElement(`input`);return i.type=e===`number`?`text`:e,i.inputMode=e===`number`?`decimal`:`text`,i.placeholder=t,i.value=n,i.className=`bm-input`,i.autocomplete=`off`,r.appendChild(i),{wrap:r,el:i}}function O(e,t){let n=parseFloat(String(e).trim());return isNaN(n)?t:n}function k(e){return String(e??``).trim().toLowerCase()}function A(e,t){let n=document.getElementById(`bm-alcodex-confirm`);n&&n.remove();let r=document.createElement(`div`);r.id=`bm-alcodex-confirm`,r.style.cssText=`
        position: fixed; inset: 0; z-index: 99999;
        display: flex; align-items: center; justify-content: center;
    `;let i=document.createElement(`div`);i.style.cssText=`
        position: absolute; inset: 0;
        background: rgba(0,0,0,0.6); backdrop-filter: blur(2px);
    `,e.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`);let a=document.createElement(`div`);a.style.cssText=`
        position: relative; background: #1e1e1e; border-radius: 16px;
        padding: 24px; width: min(320px, 85vw); text-align: center;
        box-shadow: 0 8px 32px rgba(0,0,0,0.5);
    `,a.innerHTML=`
        <p style="margin:0 0 6px; font-size:17px; font-weight:600; color:#fff;">
            ${u.alcodex_title}
        </p>
        <p style="margin:0 0 20px; font-size:14px; color:rgba(255,255,255,0.55);">
           ${u.alcodex_sub}
        </p>
        <div style="display:flex; gap:10px;">
            <button id="bm-alcodex-skip-btn" style="
                flex:1; padding:12px; border-radius:10px; border:none;
                background:rgba(255,255,255,0.1); color:#fff; font-size:15px; cursor:pointer;">
                ${u.skip}
            </button>
            <button id="bm-alcodex-add-btn" style="
                flex:1; padding:12px; border-radius:10px; border:none;
                background:#EFAB27; color:#000; font-size:15px;
                font-weight:600; cursor:pointer;">
                ${u.add}
            </button>
        </div>
    `,r.appendChild(i),r.appendChild(a),document.body.appendChild(r);let o=()=>r.remove();i.addEventListener(`click`,o),a.querySelector(`#bm-alcodex-skip-btn`).addEventListener(`click`,o),a.querySelector(`#bm-alcodex-add-btn`).addEventListener(`click`,async()=>{o(),await t()})}function j(e){let t=document.createElement(`div`);t.className=`bm-toast`,t.textContent=e,document.body.appendChild(t),requestAnimationFrame(()=>t.classList.add(`bm-toast--visible`)),setTimeout(()=>{t.classList.remove(`bm-toast--visible`),t.addEventListener(`transitionend`,()=>t.remove(),{once:!0})},3500)}var M=t((()=>{h(),f(),v(),l(),s()})),N=t((()=>{})),P,F=t((()=>{e(),N(),s(),P=n(`CameraPreview`,{web:()=>c(()=>import(`./web-D-xz2FZk.js`).then(e=>new e.CameraPreviewWeb),__vite__mapDeps([5,2]))})})),I=t((()=>{})),L,R=t((()=>{e(),I(),s(),L=n(`App`,{web:()=>c(()=>import(`./web-DwB7M3SQ.js`).then(e=>new e.AppWeb),__vite__mapDeps([6,2]))})})),z=t((()=>{})),B=t((()=>{}));function V(e){oe(e.detail.line,()=>K(Y,X),()=>{})}function H(){K(Y,X)}function U(e){e.innerHTML=`
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
        <h2>${u.welcome}</h2>
        <p>${u.welcome_sub}</p>
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
  `,de()}async function de(){let e=document.getElementById(`page-home`),t=document.getElementById(`feedRecyclerView`),n=document.getElementById(`welcomeText`),r=document.getElementById(`addButton`),i=document.getElementById(`exitButton`),a=document.getElementById(`captureButton`),o=document.getElementById(`previewView`);Y=t,X=n,await fe(),await p(),await g(),await K(t,n),r.addEventListener(`click`,async()=>{e.classList.add(`camera-active`),r.style.display=`none`,await me()}),o.addEventListener(`click`,async e=>{e.target.closest(`#captureButton`)||e.target.closest(`#exitButton`)||await he()}),i.addEventListener(`click`,async()=>{await G(e,r)}),a.addEventListener(`click`,async()=>{await ge(e,r,t,n)})}async function fe(){if(r.isNativePlatform())try{let{Camera:e}=await c(async()=>{let{Camera:e}=await import(`./esm-BVQEPyer.js`);return{Camera:e}},__vite__mapDeps([7,2]));await e.requestPermissions({permissions:[`camera`]}),await C.requestPermissions()}catch(e){console.error(`Failed to request permissions:`,e)}}async function pe(){try{let{coords:e}=await C.getCurrentPosition({enableHighAccuracy:!0,timeout:1e4});return[e.latitude,e.longitude]}catch(e){return console.error(`Location error:`,e),W(u.location_error??`Location unavailable`),[0,0]}}function W(e){let t=document.createElement(`div`);t.textContent=e,t.style.cssText=`
        position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%);
        background: rgba(0,0,0,0.75); color: #fff; padding: 8px 16px;
        border-radius: 20px; font-size: 13px; z-index: 9999;
        pointer-events: none; white-space: nowrap;
    `,document.body.appendChild(t),setTimeout(()=>t.remove(),3e3)}async function me(){try{await P.start({position:Q,parent:`previewView`,toBack:!0,width:window.innerWidth,height:window.innerHeight}),Z=!0}catch(e){console.error(`Failed to start camera:`,JSON.stringify(e))}}async function G(e,t){if(Z){try{await P.stop()}catch(e){console.error(`Failed to stop camera:`,JSON.stringify(e))}Z=!1,e.classList.remove(`camera-active`),t.style.display=`flex`}}async function he(){Q=Q===`rear`?`front`:`rear`;try{await P.flip()}catch(e){console.error(`Failed to flip camera:`,JSON.stringify(e))}}async function ge(e,t,n,r){if(!Z)return;let i=null;try{let{value:s}=await P.capture({quality:90}),c=new Date,l=e=>String(e).padStart(2,`0`);i=`photo_${`${c.getFullYear()}${l(c.getMonth()+1)}${l(c.getDate())}_${l(c.getHours())}${l(c.getMinutes())}${l(c.getSeconds())}`}.jpg`;let u=pe();await a.writeFile({path:`pics/${i}`,data:s,directory:o.External,recursive:!0}),console.log(`Photo saved:`,i),await G(e,t),await new Promise(e=>setTimeout(e,150)),w(i,u,()=>K(n,r),()=>{})}catch(e){console.error(`Failed to capture or save photo:`,JSON.stringify(e)),W(`Failed to save photo. Please try again.`)}}async function K(e,t){let n=await _();if(n.length===0){t.classList.remove(`hidden`);return}t.classList.add(`hidden`),e.innerHTML=``;let r=n.reverse().map((t,n)=>{let r=new ae(``,t),i=_e(r);return n>=$&&i.classList.add(`bc-lazy`),e.appendChild(i),{beer:t,feedItem:r,card:i,index:n}}),i=r.slice(0,$);await Promise.all(i.map(({beer:e,card:t,feedItem:n})=>q(e,t,n)));let a=r.slice($);if(a.length===0)return;let o=new IntersectionObserver(e=>{e.forEach(e=>{if(!e.isIntersecting)return;let t=e.target;o.unobserve(t);let n=a.find(e=>e.card===t);n&&q(n.beer,n.card,n.feedItem).then(()=>{requestAnimationFrame(()=>t.classList.add(`bc-lazy--visible`))})})},{rootMargin:`0px 0px 120px 0px`,threshold:0});a.forEach(({card:e})=>o.observe(e))}async function q(e,t,n){if(e.Picture)try{let i=await a.getUri({path:`pics/${e.Picture}`,directory:o.External}),s=r.convertFileSrc(i.uri);n&&(n.getImageUrl=()=>s);let c=t.querySelector(`.bc-photo-wrapper`),l=c.querySelector(`.bc-photo-placeholder`),u=document.createElement(`img`);u.className=`bc-photo`,u.alt=t.querySelector(`.bc-title`)?.textContent??``,u.src=s,u.addEventListener(`load`,()=>{l?.remove(),c.insertBefore(u,c.firstChild)},{once:!0}),u.addEventListener(`error`,()=>{console.error(`Image failed to load:`,s)},{once:!0})}catch(e){console.error(`Failed to resolve image URI:`,JSON.stringify(e))}}function _e(e){let t=e.getLine(),n=t.Title,r=`${t.Date.slice(8,10)}-${t.Date.slice(5,7)}`,i=document.createElement(`div`);return i.className=`beer-card`,i.innerHTML=`
        <div class="bc-photo-wrapper">
            <div class="bc-photo-placeholder"></div>
            <div class="bc-scrim"></div>
            <span class="bc-title">${J(n)}</span>
            <span class="bc-date">${J(r)}</span>
        </div>
    `,i.addEventListener(`click`,()=>x(e)),i}function J(e){return String(e??``).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}var Y,X,Z,Q,$;t((()=>{ie(),h(),ne(),M(),f(),i(),e(),F(),re(),R(),z(),te(),B(),s(),Y=null,X=null,document.addEventListener(`feedcard:edit`,V),document.addEventListener(`feedcard:deleted`,H),Z=!1,Q=`rear`,$=10,L.addListener(`backButton`,()=>{S()&&b()})}))();export{U as render};