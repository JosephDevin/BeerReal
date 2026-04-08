import{a as e,c as n,t as r}from"./dist-DVAlI8Z_.js";import{n as i,t as a}from"./esm-QZTRPYcA.js";import{t as o}from"./definitions-BPUFIQlX.js";import{i as s,n as c,r as l,t as u}from"./strings-CpTbGbey.js";import{n as d,r as f,t as p}from"./index-CdJaIm7p.js";import{a as m,i as h,n as g,o as _,r as v,s as y,t as b}from"./achievementHandler-D5arN7dd.js";var x=n((()=>{})),S=n((()=>{}));async function C(){await v.init();let e=document.createElement(`div`);e.className=`ach-backdrop`;let n=document.createElement(`div`);n.className=`ach-dialog`,n.setAttribute(`role`,`dialog`),n.setAttribute(`aria-modal`,`true`),n.setAttribute(`aria-label`,`Achievements`);let r=document.createElement(`div`);r.className=`ach-drag-handle`;let i=document.createElement(`div`);i.className=`ach-header`;let a=document.createElement(`h2`);a.className=`ach-title`,a.textContent=c.achievement_title;let o=document.createElement(`button`);o.className=`ach-close`,o.setAttribute(`aria-label`,`Close`),o.innerHTML=`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>`,i.appendChild(a),i.appendChild(o);let s=document.createElement(`div`);s.className=`ach-body`;let l=w(s,`unlocked`),u=w(s,`locked`);E(l,u);let d=document.createElement(`p`);d.className=`ach-footer`,d.textContent=c.warning,s.appendChild(d),n.appendChild(r),n.appendChild(i),n.appendChild(s),e.appendChild(n),document.body.appendChild(e),requestAnimationFrame(()=>requestAnimationFrame(()=>e.classList.add(`ach-backdrop--visible`)));function f(){e.classList.remove(`ach-backdrop--visible`),e.addEventListener(`transitionend`,()=>e.remove(),{once:!0})}o.addEventListener(`click`,f),e.addEventListener(`click`,n=>{n.target===e&&f()}),O(n,s,f),b(!1).then(e=>{e.length!==0&&(l.list.innerHTML=``,u.list.innerHTML=``,E(l,u),T(l),T(u))}).catch(console.error)}function w(e,n){let r=document.createElement(`div`);r.className=`ach-section`;let i=document.createElement(`p`);i.className=`ach-section-heading`;let a=document.createElement(`div`);return a.className=`ach-list`,r.appendChild(i),r.appendChild(a),e.appendChild(r),{heading:i,list:a,type:n}}function T({heading:e,list:n,type:r}){let i=n.querySelectorAll(`.ach-row`).length;e.textContent=r===`unlocked`?c.unlocked+i:c.locked+i}function E(e,n){let r=v.getAllUnlocked(),i=v.getAllLocked();r.forEach((n,i)=>D(e.list,n,`unlocked`,i<r.length-1)),i.forEach((e,r)=>D(n.list,e,`locked`,r<i.length-1)),T(e),T(n)}function D(e,n,r,i){let a=document.createElement(`div`);a.className=`ach-row ach-row--${r}`;let o=document.createElement(`span`);o.className=`ach-row-icon`,o.textContent=r===`unlocked`?`✓`:`🔒`;let s=document.createElement(`span`);if(s.className=`ach-row-label`,s.textContent=n.name,a.appendChild(o),a.appendChild(s),e.appendChild(a),a.addEventListener(`click`,()=>k(a,n.description)),i){let n=document.createElement(`div`);n.className=`ach-divider`,e.appendChild(n)}}function O(e,n,r){let i=0,a=!1;e.addEventListener(`touchstart`,e=>{i=e.touches[0].clientY,a=!1},{passive:!0}),e.addEventListener(`touchmove`,r=>{let o=r.touches[0].clientY-i;o>0&&n.scrollTop===0&&(a=!0,e.style.transform=`translateY(${o}px)`,e.style.transition=`none`)},{passive:!0}),e.addEventListener(`touchend`,n=>{let o=n.changedTouches[0].clientY-i;a&&o>80?(e.style.transition=`transform 0.2s ease`,e.style.transform=`translateY(${window.innerHeight}px)`,setTimeout(r,200)):(e.style.transition=``,e.style.transform=``),a=!1},{passive:!0})}function k(e,n){A&&=(A.remove(),null);let r=document.createElement(`div`);r.className=`ach-tooltip`,r.textContent=n,e.parentNode.insertBefore(r,e.nextSibling),A=r,requestAnimationFrame(()=>requestAnimationFrame(()=>r.classList.add(`ach-tooltip--visible`)));let i=()=>{r.classList.remove(`ach-tooltip--visible`),r.addEventListener(`transitionend`,()=>{r.remove(),A===r&&(A=null)},{once:!0})},a=setTimeout(i,2e3),o=e=>{r.contains(e.target)||(clearTimeout(a),i(),document.removeEventListener(`click`,o,!0))};setTimeout(()=>document.addEventListener(`click`,o,!0),0)}var A,j=n((()=>{h(),g(),u(),A=null})),M=n((()=>{}));async function N(){await l.init(),P(l.getBeers())}function P(e){let n=Object.entries(e).sort(([e],[n])=>e.localeCompare(n)),r=n.length,i=document.createElement(`div`);i.className=`bm-backdrop`;let a=document.createElement(`div`);a.className=`bm-dialog alcodex-dialog`,a.setAttribute(`role`,`dialog`),a.setAttribute(`aria-modal`,`true`),a.setAttribute(`aria-label`,`Alcodex`);let o=document.createElement(`div`);o.className=`alcodex-drag-handle`;let s=document.createElement(`h2`);s.className=`bm-title`,s.textContent=`Alcodex — ${r}`;let c=document.createElement(`div`);c.className=`bm-body alcodex-body`;let l=document.createElement(`div`);if(l.className=`alcodex-grid`,r===0){let e=document.createElement(`p`);e.className=`alcodex-empty`,e.textContent=t.alcodex_empty,l.appendChild(e)}else for(let[e,r]of n)l.appendChild(I(e,r));c.appendChild(l),a.appendChild(o),a.appendChild(s),a.appendChild(c),i.appendChild(a),document.body.appendChild(i),requestAnimationFrame(()=>requestAnimationFrame(()=>i.classList.add(`bm-backdrop--visible`))),L(l,Object.fromEntries(n));function u(){i.classList.remove(`bm-backdrop--visible`),i.addEventListener(`transitionend`,()=>i.remove(),{once:!0})}i.addEventListener(`click`,e=>{e.target===i&&u()}),F(a,c,u)}function F(e,n,r){let i=0,a=!1;e.addEventListener(`touchstart`,e=>{i=e.touches[0].clientY,a=!1},{passive:!0}),e.addEventListener(`touchmove`,r=>{let o=r.touches[0].clientY-i;o>0&&n.scrollTop===0&&(a=!0,e.style.transform=`translateY(${o}px)`,e.style.transition=`none`)},{passive:!0}),e.addEventListener(`touchend`,n=>{let o=n.changedTouches[0].clientY-i;a&&o>80?(e.style.transition=`transform 0.2s ease`,e.style.transform=`translateY(${window.innerHeight}px)`,setTimeout(r,200)):(e.style.transition=``,e.style.transform=``),a=!1},{passive:!0})}function I(e,n){let r=document.createElement(`div`);r.className=`alcodex-card`,r.dataset.brand=e;let i=document.createElement(`img`);i.className=`alcodex-img`,i.alt=e,i.src=``,i.dataset.photoPath=n.photoPath??``,R(i);let a=document.createElement(`span`);return a.className=`alcodex-label`,a.textContent=e,r.appendChild(i),r.appendChild(a),r}async function L(e,n){let i=e.querySelectorAll(`.alcodex-card`);for(let e of i){let i=e.dataset.brand,s=n[i],c=e.querySelector(`.alcodex-img`);if(!(!s?.hasImage||!s.photoPath))try{let e=await a.getUri({path:`pics/${s.photoPath}`,directory:o.External}),n=r.convertFileSrc(e.uri);c.onload=()=>c.classList.add(`alcodex-img--loaded`),c.onerror=()=>R(c),c.src=n}catch(e){console.warn(`Alcodex: could not load image for "${i}"`,e)}}}function R(e){e.src=`data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2080%20100%22%20width%3D%2280%22%20height%3D%22100%22%3E%0A%20%20%20%20%20%20%20%20%3Crect%20width%3D%2280%22%20height%3D%22100%22%20rx%3D%2210%22%20fill%3D%22%233a3a3a%22%2F%3E%0A%20%20%20%20%20%20%20%20%3Ctext%20x%3D%2240%22%20y%3D%2258%22%20font-size%3D%2236%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3E%F0%9F%8D%BA%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E`}var z=n((()=>{i(),e(),s(),M()}));function B(e){e.innerHTML=`
    <div id="page-stats">

      <div id="stats-scroll">

        <!-- ── PILL SEGMENT SELECTOR ── -->
        <div class="pill-scroll">
          <div class="pill-container">
            <div class="pill active" data-period="alltime">${c.all_time}</div>
            <div class="pill"        data-period="year">${c.year}</div>
            <div class="pill"        data-period="month">${c.month}</div>
            <div class="pill"        data-period="week">${c.week}</div>
          </div>
        </div>

        <!-- ── TOTALS ── -->
        <div class="section-header">
          <div class="bar"></div>
          <h2>${c.totals}</h2>
        </div>

        <div class="card-row mb-20">
          <div class="stat-card">
            <div class="stat-label">${c.total_beers}</div>
            <div class="stat-value" id="tvTotalBeers">—</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">${c.total_cost}</div>
            <div class="stat-value amber" id="tvTotalCost">—</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">${c.total_volume}</div>
            <div class="stat-value" id="tvTotalVolume">—</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">${c.average_satisfaction}</div>
            <div class="stat-value" id="tvAverageSatisfaction">—</div>
          </div>
        </div>

        <!-- ── DAILY AVERAGES ── -->
        <div class="section-header">
          <div class="bar"></div>
          <h2>${c.daily_averages}</h2>
        </div>

        <div class="card-row">
          <div class="stat-card">
            <div class="stat-label">${c.beers_day}</div>
            <div class="stat-value" id="tvBeersPerDay">—</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">${c.cost_day}</div>
            <div class="stat-value amber" id="tvCostPerDay">—</div>
          </div>
        </div>

        <div class="card-full mb-20">
          <div class="stat-card">
            <div class="stat-label">${c.volume_day}</div>
            <div class="stat-value" id="tvVolumePerDay">—</div>
          </div>
        </div>

        <!-- ── FAVORITES ── -->
        <div class="section-header">
          <div class="bar"></div>
          <h2>${c.favorites}</h2>
        </div>

        <div class="card-full">
          <div class="stat-card">
            <div class="stat-label">${c.bar_fav}</div>
            <div class="stat-value medium" id="tvFavoriteBar">—</div>
          </div>
        </div>

        <div class="card-row mb-20">
          <div class="stat-card">
            <div class="stat-label">${c.brand_fav}</div>
            <div class="stat-value small" id="tvFavoriteBrand">—</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">${c.hour_fav}</div>
            <div class="stat-value small" id="tvFavoriteHour">—</div>
          </div>
        </div>

        <!-- ── MOST DRINKS ── -->
        <div class="section-header">
          <div class="bar"></div>
          <h2>${c.most_drinks}</h2>
        </div>

        <div class="card-full">
          <div class="stat-card">
            <div class="stat-label">${c.bar_most}</div>
            <div class="stat-value medium" id="tvMostBar">—</div>
          </div>
        </div>

        <div class="card-row mb-20">
          <div class="stat-card">
            <div class="stat-label">${c.brand_most}</div>
            <div class="stat-value small" id="tvMostBrand">—</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">${c.hour_most}</div>
            <div class="stat-value small" id="tvMostHour">—</div>
          </div>
        </div>

        <!-- ── STREAKS ── -->
        <div class="section-header">
          <div class="bar"></div>
          <h2>${c.streaks}</h2>
        </div>

        <div class="card-full">
          <div class="stat-card">
            <div class="progress-row">
              <span class="progress-label">${c.longest_drinking_streak}</span>
              <span class="progress-value" id="tvLongestDrinkingStreak">— days</span>
            </div>
            <div class="progress-track">
              <div class="progress-fill" id="progressDrinkingStreak"></div>
            </div>
          </div>
        </div>

        <div class="card-full mb-20">
          <div class="stat-card">
            <div class="progress-row">
              <span class="progress-label">${c.longest_sober_streak}</span>
              <span class="progress-value green" id="tvLongestNonDrinkingStreak">— days</span>
            </div>
            <div class="progress-track">
              <div class="progress-fill green" id="progressSoberStreak"></div>
            </div>
          </div>
        </div>

        <!-- ── COST BREAKDOWN ── -->
        <div class="section-header">
          <div class="bar"></div>
          <h2>${c.cost_breakdown}</h2>
        </div>

        <div class="card-row">
          <div class="stat-card">
            <div class="stat-label">${c.avg_beer}</div>
            <div class="stat-value cost amber" id="tvAvgCostPerBeer">—</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">${c.cheapest}</div>
            <div class="stat-value xsmall green" id="tvCheapestBeer">—</div>
          </div>
        </div>

        <div class="card-full mb-20">
          <div class="stat-card">
            <div class="stat-label">${c.most_expensive}</div>
            <div class="stat-value small" id="tvMostExpensiveBeer">—</div>
          </div>
        </div>

        <!-- ── HEALTH METRICS ── -->
        <div class="section-header">
          <div class="bar"></div>
          <h2>${c.health_metrics}</h2>
        </div>

        <div class="card-row mb-20">
          <div class="stat-card">
            <div class="stat-label">${c.estimated_calories}</div>
            <div class="stat-value cost" id="tvEstimatedCalories">—</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">${c.alcohol_units}</div>
            <div class="stat-value cost" id="tvAlcoholUnits">—</div>
          </div>
        </div>

        <!-- ── GLOBAL COMPARISON ── -->
        <div class="section-header">
          <div class="bar"></div>
          <h2>${c.global_comparison}</h2>
        </div>

        <div class="card-full">
          <div class="stat-card" id="countryComparisonContainer">

            <div class="country-row">
              <div class="progress-row">
                <span class="progress-label">${c.czechia}</span>
                <span class="progress-value" id="tvCzechiaRatio">—x</span>
              </div>
              <div class="progress-track"><div class="progress-fill" id="barCzechia"></div></div>
            </div>

            <div class="country-row">
              <div class="progress-row">
                <span class="progress-label">${c.latvia}</span>
                <span class="progress-value" id="tvLatviaRatio">—x</span>
              </div>
              <div class="progress-track"><div class="progress-fill" id="barLatvia"></div></div>
            </div>

            <div class="country-row">
              <div class="progress-row">
                <span class="progress-label">${c.estonia}</span>
                <span class="progress-value" id="tvEstoniaRatio">—x</span>
              </div>
              <div class="progress-track"><div class="progress-fill" id="barEstonia"></div></div>
            </div>

            <div class="country-row">
              <div class="progress-row">
                <span class="progress-label">${c.france}</span>
                <span class="progress-value" id="tvFranceRatio">—x</span>
              </div>
              <div class="progress-track"><div class="progress-fill" id="barFrance"></div></div>
            </div>

            <div class="country-row">
              <div class="progress-row">
                <span class="progress-label">${c.ireland}</span>
                <span class="progress-value" id="tvIrelandRatio">—x</span>
              </div>
              <div class="progress-track"><div class="progress-fill" id="barIreland"></div></div>
            </div>

            <div class="country-row">
              <div class="progress-row">
                <span class="progress-label">${c.usa}</span>
                <span class="progress-value" id="tvUSARatio">—x</span>
              </div>
              <div class="progress-track"><div class="progress-fill" id="barUSA"></div></div>
            </div>

            <div class="country-row">
              <div class="progress-row">
                <span class="progress-label">${c.bangladesh}</span>
                <span class="progress-value" id="tvBangladeshRatio">—x</span>
              </div>
              <div class="progress-track"><div class="progress-fill" id="barBangladesh"></div></div>
            </div>

          </div>
        </div>

        <div class="card-full mb-20">
          <div class="stat-card">
            <div class="stat-label">${c.you_drink_most_like}</div>
            <div class="stat-value cost" id="tvClosestCountry">—</div>
          </div>
        </div>

        <!-- ── BACKUP ── -->
        <div id="stats-backup-row">
          <button class="backup-btn" id="btnExportBackup">↑ Export</button>
          <span class="backup-sep">·</span>
          <button class="backup-btn" id="btnImportBackup">↓ Import</button>
        </div>

      </div>

      <!-- ── BOTTOM BAR ── -->
      <div id="stats-bottom-bar">
        <button class="bottom-btn" id="btnAchievements">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
                d="M12,14V17M12,14C9.581,14 7.563,12.282 7.1,10M12,14C14.419,14 16.437,12.282 16.9,10M17,5H19.75C19.982,5 20.098,5 20.195,5.019C20.592,5.098 20.902,5.408 20.981,5.805C21,5.902 21,6.018 21,6.25C21,6.947 21,7.295 20.942,7.585C20.706,8.775 19.775,9.706 18.585,9.942C18.295,10 17.947,10 17.25,10H17H16.9M7,5H4.25C4.018,5 3.902,5 3.805,5.019C3.408,5.098 3.098,5.408 3.019,5.805C3,5.902 3,6.018 3,6.25C3,6.947 3,7.295 3.058,7.585C3.294,8.775 4.225,9.706 5.415,9.942C5.705,10 6.053,10 6.75,10H7H7.1M12,17C12.93,17 13.395,17 13.776,17.102C14.812,17.38 15.62,18.188 15.898,19.223C16,19.605 16,20.07 16,21H8C8,20.07 8,19.605 8.102,19.223C8.38,18.188 9.188,17.38 10.224,17.102C10.605,17 11.07,17 12,17ZM7,5H4.25C4.018,5 3.902,5 3.805,5.019C3.408,5.098 3.098,5.408 3.019,5.805C3,5.902 3,6.018 3,6.25C3,6.947 3,7.295 3.058,7.585C3.294,8.775 4.225,9.706 5.415,9.942C5.705,10 6.053,10 6.75,10H7H7.1"
                stroke="#000000"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
          </svg>
        </button>
        <button class="bottom-btn" id="btnAlcodex">
          <svg viewBox="0 0 24 24"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>
        </button>
      </div>

    </div>
  `,W()}function V(e,n){let r=document.getElementById(e);r&&(r.textContent=n)}function H(e,n){let r=document.getElementById(e);r&&(r.style.width=`${Math.min(100,Math.max(0,n))}%`)}async function U(e){let n=e.getAverageSatisfaction();V(`tvTotalBeers`,e.getTotalBeers()),V(`tvTotalCost`,`${e.getTotalCost().toFixed(2)}€`),V(`tvTotalVolume`,`${e.getTotalVolume().toFixed(2)}L`),V(`tvAverageSatisfaction`,n===null?c.none:`${n.toFixed(2)}/5`),V(`tvBeersPerDay`,e.getAverageDrinksPerDay().toFixed(2)),V(`tvCostPerDay`,`${e.getAverageCostPerDay().toFixed(2)}€`),V(`tvVolumePerDay`,`${e.getAverageVolumePerDay().toFixed(2)}L`),V(`tvFavoriteBar`,e.getFavoriteBar()),V(`tvFavoriteBrand`,e.getFavoriteBrand()),V(`tvFavoriteHour`,e.getFavoriteHour()),V(`tvMostBar`,e.getMostBar()),V(`tvMostBrand`,e.getMostBrand()),V(`tvMostHour`,e.getMostHour());let r=e.getLongestDrinkingStreak(),i=e.getLongestNonDrinkingStreak(),a=Math.max(r,i,1);V(`tvLongestDrinkingStreak`,`${r} ${c.days}`),V(`tvLongestNonDrinkingStreak`,`${i} ${c.days}`),H(`progressDrinkingStreak`,r/a*100),H(`progressSoberStreak`,i/a*100),V(`tvAvgCostPerBeer`,`${e.getAverageCost().toFixed(2)}€`),V(`tvCheapestBeer`,e.getCheapestBeer()),V(`tvMostExpensiveBeer`,e.getMostExpensiveBeer()),V(`tvEstimatedCalories`,`${Math.round(e.getCaloricIntake())} kcal`),V(`tvAlcoholUnits`,`${e.getAlcoholUnits().toFixed(1)} ${c.units}`);let o=e.compareToWorldsDrinkers();V(`tvCzechiaRatio`,`${o.czechia.toFixed(1)}x`),V(`tvLatviaRatio`,`${o.latvia.toFixed(1)}x`),V(`tvEstoniaRatio`,`${o.estonia.toFixed(1)}x`),V(`tvFranceRatio`,`${o.france.toFixed(1)}x`),V(`tvIrelandRatio`,`${o.ireland.toFixed(1)}x`),V(`tvUSARatio`,`${o.usa.toFixed(1)}x`),V(`tvBangladeshRatio`,`${o.bangladesh.toFixed(1)}x`),H(`barCzechia`,o.czechia*100),H(`barLatvia`,o.latvia*100),H(`barEstonia`,o.estonia*100),H(`barFrance`,o.france*100),H(`barIreland`,o.ireland*100),H(`barUSA`,o.usa*100),H(`barBangladesh`,o.bangladesh*100),V(`tvClosestCountry`,e.getClosestCountry())}async function W(){await U(await m.create(_.ALL_TIME)),b(!1).catch(console.error);for(let e of document.querySelectorAll(`.pill`))e.addEventListener(`click`,async()=>{document.querySelectorAll(`.pill`).forEach(e=>e.classList.remove(`active`)),e.classList.add(`active`);let n=G[e.dataset.period]??_.ALL_TIME;await U(await m.create(n))});document.getElementById(`btnAchievements`).addEventListener(`click`,()=>{C()}),document.getElementById(`btnAlcodex`).addEventListener(`click`,()=>{N()});let e=document.getElementById(`btnExportBackup`),n=document.getElementById(`btnImportBackup`);e.addEventListener(`click`,()=>f(e)),n.addEventListener(`click`,()=>d())}var G;n((()=>{u(),x(),S(),y(),j(),g(),z(),p(),G={alltime:_.ALL_TIME,year:_.YEAR,month:_.MONTH,week:_.WEEK}}))();export{B as render};