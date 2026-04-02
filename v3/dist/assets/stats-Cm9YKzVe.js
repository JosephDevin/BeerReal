import{n as e}from"./chunk-CZOpNEXY.js";import{i as t,r as n}from"./csvHelper-Cys56eP6.js";import{n as r,t as i}from"./strings-DayaT0Cw.js";var a=e((()=>{}));function o(){let e=new Date().getDay();return e===0?7:e}function s(){return new Date().getDate()}function c(){let e=new Date,t=new Date(e.getFullYear(),0,0);return Math.floor((e-t)/864e5)}function l(e){if(!e.length)return 1;let t=e.map(e=>u(e.Date).getTime()).reduce((e,t)=>Math.min(e,t),1/0);return Math.max(1,Math.floor((Date.now()-t)/864e5)+1)}function u(e){let[t,n,r,i]=e.split(`-`),[a,o]=i.split(`:`);return new Date(+t,n-1,+r,+a,+o)}function d(e){return e.reduce((e,t)=>e+t,0)}function f(e){return new Set(e.map(e=>e.substring(0,10))).size}function p(e){if(!e.length)return 0;let t=[...new Set(e.map(e=>e.substring(0,10)))].sort(),n=1,r=1;for(let e=1;e<t.length;e++){let i=new Date(t[e-1]);(new Date(t[e])-i)/864e5==1?(r++,n=Math.max(n,r)):r=1}return n}function m(e){if(!e.length)return 0;let t=new Set(e.map(e=>e.substring(0,10))),n=[...t].sort(),r=new Date(n[0]),i=new Date(n[n.length-1]),a=0,o=0,s=new Date(r);for(;s<=i;){let e=s.toISOString().substring(0,10);t.has(e)?o=0:(o++,a=Math.max(a,o)),s.setDate(s.getDate()+1)}return a}var h=e((()=>{})),g,_=e((()=>{g=[{country:`Czechia`,value:.0355890411},{country:`Latvia`,value:.0344657534},{country:`Estonia`,value:.0330410959},{country:`Saint Lucia`,value:.0313150685},{country:`Lithuania`,value:.0311780822},{country:`Austria`,value:.0311506849},{country:`Republic of Moldova`,value:.0307945205},{country:`Romania`,value:.0305753425},{country:`Namibia`,value:.0300547945},{country:`Seychelles`,value:.0298082192},{country:`Bulgaria`,value:.0295890411},{country:`Belarus`,value:.0295068493},{country:`Poland`,value:.0294794521},{country:`Australia`,value:.0292328767},{country:`France`,value:.0289589041},{country:`Luxembourg`,value:.0289041096},{country:`Hungary`,value:.0289041096},{country:`Germany`,value:.0288493151},{country:`Andorra`,value:.0285753425},{country:`Portugal`,value:.0284657534},{country:`Spain`,value:.0281643836},{country:`Croatia`,value:.028},{country:`Ireland`,value:.0278082192},{country:`United Kingdom`,value:.0276986301},{country:`Slovenia`,value:.0276712329},{country:`Slovakia`,value:.0272328767},{country:`Denmark`,value:.026109589},{country:`United States of America`,value:.0257808219},{country:`Antigua and Barbuda`,value:.0250958904},{country:`Barbados`,value:.024739726},{country:`Georgia`,value:.0237534247},{country:`New Zealand`,value:.0237260274},{country:`Switzerland`,value:.0234246575},{country:`Argentina`,value:.0229863014},{country:`Brazil`,value:.0223013699},{country:`Canada`,value:.0222191781},{country:`Belgium`,value:.0221643836},{country:`Netherlands`,value:.0221369863},{country:`Finland`,value:.0218630137},{country:`Italy`,value:.0216712329},{country:`Republic of Korea`,value:.0216712329},{country:`Iceland`,value:.0215342466},{country:`Serbia`,value:.0214246575},{country:`Sweden`,value:.0206575342},{country:`Chile`,value:.0204383562},{country:`Lao People's Democratic Republic`,value:.0202739726},{country:`Russian Federation`,value:.0200547945},{country:`Montenegro`,value:.0199178082},{country:`Grenada`,value:.0196986301},{country:`Norway`,value:.0194794521},{country:`Bahamas`,value:.0193424658},{country:`Gabon`,value:.0192328767},{country:`Mongolia`,value:.0192328767},{country:`Saint Vincent and the Grenadines`,value:.0187123288},{country:`Mauritius`,value:.0181369863},{country:`Dominica`,value:.018109589},{country:`Saint Kitts and Nevis`,value:.0180547945},{country:`Thailand`,value:.0177534247},{country:`South Africa`,value:.0177534247},{country:`Greece`,value:.0170958904},{country:`Eswatini`,value:.0170410959},{country:`Japan`,value:.016739726},{country:`Paraguay`,value:.0166027397},{country:`Malta`,value:.015890411},{country:`Panama`,value:.0158630137},{country:`Uruguay`,value:.0157534247},{country:`Suriname`,value:.0148767123},{country:`Botswana`,value:.0148219178},{country:`Congo`,value:.0144383562},{country:`Guyana`,value:.0143013699},{country:`Bosnia and Herzegovina`,value:.0142465753},{country:`Equatorial Guinea`,value:.0140547945},{country:`Peru`,value:.0137808219},{country:`Mexico`,value:.0132876712},{country:`North Macedonia`,value:.0129863014},{country:`Cyprus`,value:.0128219178},{country:`Cambodia`,value:.0127945205},{country:`Burkina Faso`,value:.0127671233},{country:`Philippines`,value:.0124931507},{country:`Ukraine`,value:.0124657534},{country:`Kazakhstan`,value:.0123287671},{country:`Belize`,value:.0123287671},{country:`Dominican Republic`,value:.0119452055},{country:`Albania`,value:.0119452055},{country:`Trinidad and Tobago`,value:.0116438356},{country:`Benin`,value:.0115890411},{country:`Sao Tome and Principe`,value:.0114246575},{country:`Zimbabwe`,value:.011369863},{country:`Cuba`,value:.0113150685},{country:`Democratic People's Republic of Korea`,value:.0112876712},{country:`Colombia`,value:.0101643836},{country:`Uganda`,value:.0101369863},{country:`China`,value:.0100821918},{country:`Cabo Verde`,value:.0096438356},{country:`Kyrgyzstan`,value:.0095890411},{country:`Jamaica`,value:.0095616438},{country:`Armenia`,value:.0095342466},{country:`Costa Rica`,value:.0094520548},{country:`Nicaragua`,value:.0092876712},{country:`Viet Nam`,value:.0089315068},{country:`Burundi`,value:.0088219178},{country:`Cameroon`,value:.008739726},{country:`Cote d'Ivoire`,value:.0085753425},{country:`Angola`,value:.0085479452},{country:`Zambia`,value:.0083287671},{country:`El Salvador`,value:.0082191781},{country:`Nauru`,value:.0081369863},{country:`United Republic of Tanzania`,value:.0079178082},{country:`Turkmenistan`,value:.0078356164},{country:`Haiti`,value:.0076712329},{country:`Fiji`,value:.0076712329},{country:`Lesotho`,value:.0076438356},{country:`India`,value:.0075068493},{country:`Bolivia`,value:.0075068493},{country:`Bhutan`,value:.0074520548},{country:`Niue`,value:.0073424658},{country:`Honduras`,value:.0072876712},{country:`Sri Lanka`,value:.0072054795},{country:`Israel`,value:.0070684932},{country:`Ecuador`,value:.006630137},{country:`Nepal`,value:.0063561644},{country:`Rwanda`,value:.0062465753},{country:`Guinea-Bissau`,value:.0058630137},{country:`Samoa`,value:.0056438356},{country:`Venezuela`,value:.0055342466},{country:`Kenya`,value:.0053972603},{country:`Uzbekistan`,value:.0053150685},{country:`Mali`,value:.0052876712},{country:`Singapore`,value:.0051232877},{country:`Ghana`,value:.0050684932},{country:`Ethiopia`,value:.0046849315},{country:`Myanmar`,value:.004630137},{country:`Guatemala`,value:.0045479452},{country:`Nigeria`,value:.0044657534},{country:`Micronesia`,value:.0043287671},{country:`Türkiye`,value:.0041643836},{country:`Maldives`,value:.004109589},{country:`Central African Republic`,value:.0040547945},{country:`Bahrain`,value:.0039726027},{country:`Tunisia`,value:.0037260274},{country:`Mozambique`,value:.0036712329},{country:`Vanuatu`,value:.0036164384},{country:`Azerbaijan`,value:.0034246575},{country:`Lebanon`,value:.003369863},{country:`Qatar`,value:.0031232877},{country:`Togo`,value:.0028767123},{country:`Democratic Republic of the Congo`,value:.0026849315},{country:`United Arab Emirates`,value:.0025753425},{country:`Eritrea`,value:.0025205479},{country:`Liberia`,value:.0025205479},{country:`Malawi`,value:.0024931507},{country:`Papua New Guinea`,value:.0023013699},{country:`Solomon Islands`,value:.002109589},{country:`Tajikistan`,value:.0019726027},{country:`Malaysia`,value:.0018082192},{country:`Madagascar`,value:.0015616438},{country:`Brunei Darussalam`,value:.0014520548},{country:`Morocco`,value:.0013972603},{country:`Gambia`,value:.0012876712},{country:`Iraq`,value:.001260274},{country:`Chad`,value:.0011506849},{country:`Algeria`,value:.0011506849},{country:`Oman`,value:.0010958904},{country:`Guinea`,value:.0010410959},{country:`Kiribati`,value:.0010410959},{country:`Senegal`,value:.0007945205},{country:`Tonga`,value:.0007945205},{country:`Comoros`,value:.0007945205},{country:`Djibouti`,value:.0006849315},{country:`Sierra Leone`,value:.0006575342},{country:`Tuvalu`,value:630137e-9},{country:`Jordan`,value:.0006027397},{country:`Timor-Leste`,value:.0004109589},{country:`Niger`,value:.0003013699},{country:`Egypt`,value:.0002438356},{country:`Syrian Arab Republic`,value:.0001753425},{country:`Indonesia`,value:.0001671233},{country:`Pakistan`,value:.0001424658},{country:`Kuwait`,value:.0001041096},{country:`Bangladesh`,value:54795e-10},{country:`Iran`,value:0},{country:`Sudan`,value:0},{country:`Mauritania`,value:0},{country:`Libya`,value:0},{country:`Afghanistan`,value:0},{country:`Yemen`,value:0},{country:`Somalia`,value:0}]})),v,y,b=e((()=>{t(),h(),_(),v=Object.freeze({WEEK:`WEEK`,MONTH:`MONTH`,YEAR:`YEAR`,ALL_TIME:`ALL_TIME`}),y=class e{constructor(e,t){if(this._lines=e,this._time=t,this._filteredLines=[],this._brands=[],this._volumes=[],this._prices=[],this._dates=[],this._bars=[],this._ratings=[],this.size=0,this.pricesTotal=0,this.volumeTotal=0,this.uniqueDays=0,this.days=0,e.length){switch(t){case v.WEEK:this.days=o();break;case v.MONTH:this.days=s();break;case v.ALL_TIME:this.days=l(e);break;default:this.days=c();break}this._selectTimeToLoad()}}static async create(t){return new e(await n(),t)}_selectTimeToLoad(){switch(this._time){case v.WEEK:this._filteredLines=this._linesThisWeek();break;case v.MONTH:this._filteredLines=this._linesThisMonth();break;case v.YEAR:this._filteredLines=this._linesThisYear();break;case v.ALL_TIME:this._filteredLines=this._lines;break}this._loadAllLines(this._filteredLines)}_loadAllLines(e){for(let t of e)this.size++,this._brands.push(t.Brand),this._volumes.push(t.Volume),this._prices.push(t.Price),this._dates.push(t.Date),this._bars.push(t.Bar),this._ratings.push(t.Rating);this.pricesTotal=d(this._prices),this.volumeTotal=d(this._volumes),this.uniqueDays=f(this._dates)}_isoWeek(e){let t=new Date(Date.UTC(e.getFullYear(),e.getMonth(),e.getDate())),n=t.getUTCDay()||7;t.setUTCDate(t.getUTCDate()+4-n);let r=new Date(Date.UTC(t.getUTCFullYear(),0,1));return Math.ceil(((t-r)/864e5+1)/7)}_linesThisWeek(){let e=new Date,t=this._isoWeek(e),n=e.getFullYear();return this._lines.filter(e=>{let r=u(e.Date);return this._isoWeek(r)===t&&r.getFullYear()===n})}_linesThisMonth(){let e=new Date;return this._lines.filter(t=>{let n=u(t.Date);return n.getMonth()===e.getMonth()&&n.getFullYear()===e.getFullYear()})}_linesThisYear(){let e=new Date().getFullYear();return this._lines.filter(t=>u(t.Date).getFullYear()===e)}getTotalBeers(){return this.size}getTotalCost(){return this.pricesTotal}getTotalVolume(){return this.volumeTotal}getAverageSatisfaction(){return this.size===0?null:d(this._ratings)/this.size}getAverageDrinksPerDay(){return this.size===0?0:this.size/this.days}getAverageCostPerDay(){return this.size===0?0:this.pricesTotal/this.days}getAverageVolumePerDay(){return this.size===0?0:this.volumeTotal/this.days}_pickMostRecent(e,t,n=3){let r=new Set(e),i=[];for(let e=this._filteredLines.length-1;e>=0&&i.length<n;e--){let n=t(this._filteredLines[e]);n!==null&&r.has(n)&&!i.includes(n)&&i.push(n)}return i.join(`, `)+(e.length>n?`, ...`:``)}getFavoriteBar(){if(this.size===0)return`None`;let e={},t={};for(let n of this._filteredLines){let r=n.Bar.trim().toLowerCase();e[r]=(e[r]||0)+n.Rating,t[r]=(t[r]||0)+1}let n=-1,r=[];for(let i of Object.keys(e)){let a=e[i]/t[i];a>n?(n=a,r.length=0,r.push(i)):a===n&&r.push(i)}return`${r.length===1?r[0]:this._pickMostRecent(r,e=>e.Bar.trim().toLowerCase())} (${n.toFixed(2)})`}getFavoriteBrand(){if(!this._brands.length)return`None`;let e={};for(let t=0;t<this._brands.length;t++){let n=this._brands[t];e[n]||(e[n]=[]),e[n].push(this._ratings[t])}let t=-1,n=[];for(let[r,i]of Object.entries(e)){let e=d(i)/i.length;e>t?(t=e,n.length=0,n.push(r)):e===t&&n.push(r)}return n.length===1?n[0]:this._pickMostRecent(n,e=>e.Brand)}getFavoriteHour(){if(this.size===0)return`None`;let e={},t={};for(let n of this._filteredLines)if(n.Date?.length>=13){let r=n.Date.substring(11,13);e[r]=(e[r]||0)+n.Rating,t[r]=(t[r]||0)+1}let n=-1,r=[];for(let i of Object.keys(e)){let a=e[i]/t[i];a>n?(n=a,r.length=0,r.push(i)):a===n&&r.push(i)}return`${r.length===1?r[0]:this._pickMostRecent(r,e=>e.Date?.substring(11,13)??null)}h (${n.toFixed(2)})`}getUniqueBars(){return new Set(this._bars.filter(e=>e?.trim()).map(e=>e.trim())).size}isBrandNew(e){return!this._brands.some(t=>t?.toLowerCase()===e.toLowerCase())}_getMostWithRecency(e,t){if(!e.length)return`None`;let n={};for(let t of e){let e=t.trim().toLowerCase();n[e]=(n[e]||0)+1}let r=0,i=[];for(let[e,t]of Object.entries(n))t>r?(r=t,i.length=0,i.push(e)):t===r&&i.push(e);return`${i.length===1?i[0]:this._pickMostRecent(i,t)} (${r})`}getMostBar(){return this._getMostWithRecency(this._bars,e=>e.Bar.trim().toLowerCase())}getMostBrand(){return this._getMostWithRecency(this._brands,e=>e.Brand.trim().toLowerCase())}getMostHour(){let e=this._dates.map(e=>{let t=e.split(`-`);return t.length>=4?t[3].substring(0,2):null}).filter(Boolean);return this._getMostWithRecency(e,e=>{let t=e.Date?.split(`-`);return t?.length>=4?t[3].substring(0,2):null})}getAverageCost(){return this.size===0?0:this.pricesTotal/this.size}getCheapestBeer(){if(!this._filteredLines.length)return`None`;let e=this._filteredLines.reduce((e,t)=>t.Price<e.Price?t:e);return`${e.Price.toFixed(2)}€ - ${e.Brand.trim()} @ ${e.Bar.trim()}`}getCheapestBeerPrice(){let e=this._filteredLines.filter(e=>e.Price>0);return e.length?Math.min(...e.map(e=>e.Price)):-1}getMostExpensiveBeer(){if(!this._filteredLines.length)return`None`;let e=this._filteredLines.reduce((e,t)=>t.Price>e.Price?t:e);return`${e.Price.toFixed(2)}€ - ${e.Brand.trim()} @ ${e.Bar.trim()}`}getLongestDrinkingStreak(){return p(this._dates)}getLongestNonDrinkingStreak(){return m(this._dates)}getCaloricIntake(){return this.size===0?0:this.volumeTotal/.5*215.4}getAlcoholUnits(){return this.size===0?0:this.volumeTotal*.05/.01}getClosestCountry(){if(this.size===0)return``;let e=this.getAlcoholUnits()*.01/this.days;return g.reduce((t,n)=>Math.abs(n.value-e)<Math.abs(t.value-e)?n:t).country}compareToWorldsDrinkers(){if(this.size===0)return{czechia:0,latvia:0,estonia:0,france:0,ireland:0,usa:0,bangladesh:0};let e=this.getAlcoholUnits()*.01/this.days;return{czechia:e/.0355890411,latvia:e/.0344657534,estonia:e/.0330410959,france:e/.0289589041,ireland:e/.0278082192,usa:e/.0257808219,bangladesh:e/54795e-10}}toString(){let e=this.compareToWorldsDrinkers();return[`📊 Beer Stats Summary`,`-----------------------------`,`🍺 Total Beers: ${this.getTotalBeers()}`,`💶 Total Cost: ${this.getTotalCost().toFixed(2)}€`,`📦 Total Volume: ${this.getTotalVolume().toFixed(2)}L`,`⭐ Average Satisfaction: ${this.getAverageSatisfaction().toFixed(2)}/5.0`,``,`📅 Daily Averages`,`🍺 Beers/Day: ${this.getAverageDrinksPerDay().toFixed(2)}`,`💶 Cost/Day: ${this.getAverageCostPerDay().toFixed(2)}€`,``,`🏆 Favorites`,`📍 Bar: ${this.getFavoriteBar()}`,`🏷️ Brand: ${this.getFavoriteBrand()}`,`🕔 Hour: ${this.getFavoriteHour()}`,``,`📈 Streaks`,`🔥 Longest Drinking Streak: ${this.getLongestDrinkingStreak()} day(s)`,`❄️ Longest Non-Drinking Streak: ${this.getLongestNonDrinkingStreak()} day(s)`,``,`💸 Cost Breakdown`,`💶 Avg Cost per Beer: ${this.getAverageCost().toFixed(2)}€`,`🟢 Cheapest: ${this.getCheapestBeer()}`,`🔴 Most Expensive: ${this.getMostExpensiveBeer()}`,``,`🧠 Health Metrics`,`🔥 Estimated Calories: ${Math.round(this.getCaloricIntake())} kcal`,`🥴 Alcohol Units: ${this.getAlcoholUnits().toFixed(2)}`,``,`🌍 Global Comparison (your daily alcohol vs per-capita average)`,`🇨🇿 Czechia: ${e.czechia.toFixed(2)}x`,`🇱🇻 Latvia: ${e.latvia.toFixed(2)}x`,`🇪🇪 Estonia: ${e.estonia.toFixed(2)}x`,`🇫🇷 France: ${e.france.toFixed(2)}x`,`🇮🇪 Ireland: ${e.ireland.toFixed(2)}x`,`🇺🇸 USA: ${e.usa.toFixed(2)}x`,`🇧🇩 Bangladesh: ${e.bangladesh.toFixed(2)}x`].join(`
`)}}}));function x(e){e.innerHTML=`
    <div id="page-stats">

      <div id="stats-scroll">

        <!-- ── PILL SEGMENT SELECTOR ── -->
        <div class="pill-scroll">
          <div class="pill-container">
            <div class="pill active" data-period="alltime">${r.all_time}</div>
            <div class="pill"        data-period="year">${r.year}</div>
            <div class="pill"        data-period="month">${r.month}</div>
            <div class="pill"        data-period="week">${r.week}</div>
          </div>
        </div>

        <!-- ── TOTALS ── -->
        <div class="section-header">
          <div class="bar"></div>
          <h2>${r.totals}</h2>
        </div>

        <div class="card-row mb-20">
          <div class="stat-card">
            <div class="stat-label">${r.total_beers}</div>
            <div class="stat-value" id="tvTotalBeers">—</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">${r.total_cost}</div>
            <div class="stat-value amber" id="tvTotalCost">—</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">${r.total_volume}</div>
            <div class="stat-value" id="tvTotalVolume">—</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">${r.average_satisfaction}</div>
            <div class="stat-value" id="tvAverageSatisfaction">—</div>
          </div>
        </div>

        <!-- ── DAILY AVERAGES ── -->
        <div class="section-header">
          <div class="bar"></div>
          <h2>${r.daily_averages}</h2>
        </div>

        <div class="card-row">
          <div class="stat-card">
            <div class="stat-label">${r.beers_day}</div>
            <div class="stat-value" id="tvBeersPerDay">—</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">${r.cost_day}</div>
            <div class="stat-value amber" id="tvCostPerDay">—</div>
          </div>
        </div>

        <div class="card-full mb-20">
          <div class="stat-card">
            <div class="stat-label">${r.volume_day}</div>
            <div class="stat-value" id="tvVolumePerDay">—</div>
          </div>
        </div>

        <!-- ── FAVORITES ── -->
        <div class="section-header">
          <div class="bar"></div>
          <h2>${r.favorites}</h2>
        </div>

        <div class="card-full">
          <div class="stat-card">
            <div class="stat-label">${r.bar_fav}</div>
            <div class="stat-value medium" id="tvFavoriteBar">—</div>
          </div>
        </div>

        <div class="card-row mb-20">
          <div class="stat-card">
            <div class="stat-label">${r.brand_fav}</div>
            <div class="stat-value small" id="tvFavoriteBrand">—</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">${r.hour_fav}</div>
            <div class="stat-value small" id="tvFavoriteHour">—</div>
          </div>
        </div>

        <!-- ── MOST DRINKS ── -->
        <div class="section-header">
          <div class="bar"></div>
          <h2>${r.most_drinks}</h2>
        </div>

        <div class="card-full">
          <div class="stat-card">
            <div class="stat-label">${r.bar_most}</div>
            <div class="stat-value medium" id="tvMostBar">—</div>
          </div>
        </div>

        <div class="card-row mb-20">
          <div class="stat-card">
            <div class="stat-label">${r.brand_most}</div>
            <div class="stat-value small" id="tvMostBrand">—</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">${r.hour_most}</div>
            <div class="stat-value small" id="tvMostHour">—</div>
          </div>
        </div>

        <!-- ── STREAKS ── -->
        <div class="section-header">
          <div class="bar"></div>
          <h2>${r.streaks}</h2>
        </div>

        <div class="card-full">
          <div class="stat-card">
            <div class="progress-row">
              <span class="progress-label">${r.longest_drinking_streak}</span>
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
              <span class="progress-label">${r.longest_sober_streak}</span>
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
          <h2>${r.cost_breakdown}</h2>
        </div>

        <div class="card-row">
          <div class="stat-card">
            <div class="stat-label">${r.avg_beer}</div>
            <div class="stat-value cost amber" id="tvAvgCostPerBeer">—</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">${r.cheapest}</div>
            <div class="stat-value xsmall green" id="tvCheapestBeer">—</div>
          </div>
        </div>

        <div class="card-full mb-20">
          <div class="stat-card">
            <div class="stat-label">${r.most_expensive}</div>
            <div class="stat-value small" id="tvMostExpensiveBeer">—</div>
          </div>
        </div>

        <!-- ── HEALTH METRICS ── -->
        <div class="section-header">
          <div class="bar"></div>
          <h2>${r.health_metrics}</h2>
        </div>

        <div class="card-row mb-20">
          <div class="stat-card">
            <div class="stat-label">${r.estimated_calories}</div>
            <div class="stat-value cost" id="tvEstimatedCalories">—</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">${r.alcohol_units}</div>
            <div class="stat-value cost" id="tvAlcoholUnits">—</div>
          </div>
        </div>

        <!-- ── GLOBAL COMPARISON ── -->
        <div class="section-header">
          <div class="bar"></div>
          <h2>${r.global_comparison}</h2>
        </div>

        <div class="card-full">
          <div class="stat-card" id="countryComparisonContainer">

            <div class="country-row">
              <div class="progress-row">
                <span class="progress-label">${r.czechia}</span>
                <span class="progress-value" id="tvCzechiaRatio">—x</span>
              </div>
              <div class="progress-track"><div class="progress-fill" id="barCzechia"></div></div>
            </div>

            <div class="country-row">
              <div class="progress-row">
                <span class="progress-label">${r.latvia}</span>
                <span class="progress-value" id="tvLatviaRatio">—x</span>
              </div>
              <div class="progress-track"><div class="progress-fill" id="barLatvia"></div></div>
            </div>

            <div class="country-row">
              <div class="progress-row">
                <span class="progress-label">${r.estonia}</span>
                <span class="progress-value" id="tvEstoniaRatio">—x</span>
              </div>
              <div class="progress-track"><div class="progress-fill" id="barEstonia"></div></div>
            </div>

            <div class="country-row">
              <div class="progress-row">
                <span class="progress-label">${r.france}</span>
                <span class="progress-value" id="tvFranceRatio">—x</span>
              </div>
              <div class="progress-track"><div class="progress-fill" id="barFrance"></div></div>
            </div>

            <div class="country-row">
              <div class="progress-row">
                <span class="progress-label">${r.ireland}</span>
                <span class="progress-value" id="tvIrelandRatio">—x</span>
              </div>
              <div class="progress-track"><div class="progress-fill" id="barIreland"></div></div>
            </div>

            <div class="country-row">
              <div class="progress-row">
                <span class="progress-label">${r.usa}</span>
                <span class="progress-value" id="tvUSARatio">—x</span>
              </div>
              <div class="progress-track"><div class="progress-fill" id="barUSA"></div></div>
            </div>

            <div class="country-row">
              <div class="progress-row">
                <span class="progress-label">${r.bangladesh}</span>
                <span class="progress-value" id="tvBangladeshRatio">—x</span>
              </div>
              <div class="progress-track"><div class="progress-fill" id="barBangladesh"></div></div>
            </div>

          </div>
        </div>

        <div class="card-full mb-20">
          <div class="stat-card">
            <div class="stat-label">${r.you_drink_most_like}</div>
            <div class="stat-value cost" id="tvClosestCountry">—</div>
          </div>
        </div>

      </div>

      <!-- ── BOTTOM BAR ── -->
      <div id="stats-bottom-bar">
        <button class="bottom-btn" id="btnAchievements">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
                d="M12,14V17M12,14C9.581,14 7.563,12.282 7.1,10M12,14C14.419,14 16.437,12.282 16.9,10M17,5H19.75C19.982,5 20.098,5 20.195,5.019C20.592,5.098 20.902,5.408 20.981,5.805C21,5.902 21,6.018 21,6.25C21,6.947 21,7.295 20.942,7.585C20.706,8.775 19.775,9.706 18.585,9.942C18.295,10 17.947,10 17.25,10H17H16.9M7,5H4.25C4.018,5 3.902,5 3.805,5.019C3.408,5.098 3.098,5.408 3.019,5.805C3,5.902 3,6.018 3,6.25C3,6.947 3,7.295 3.058,7.585C3.294,8.775 4.225,9.706 5.415,9.942C5.705,10 6.053,10 6.75,10H7H7.1M12,17C12.93,17 13.395,17 13.776,17.102C14.812,17.38 15.62,18.188 15.898,19.223C16,19.605 16,20.07 16,21H8C8,20.07 8,19.605 8.102,19.223C8.38,18.188 9.188,17.38 10.224,17.102C10.605,17 11.07,17 12,17ZM7.1,10C7.034,9.677 7,9.342 7,9V4.571C7,4.038 7,3.772 7.099,3.566C7.197,3.362 7.362,3.197 7.566,3.099C7.772,3 8.038,3 8.571,3H15.429C15.962,3 16.228,3 16.434,3.099C16.638,3.197 16.803,3.362 16.901,3.566C17,3.772 17,4.038 17,4.571V9C17,9.342 16.966,9.677 16.9,10"
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
  `,T()}function S(e,t){let n=document.getElementById(e);n&&(n.textContent=t)}function C(e,t){let n=document.getElementById(e);n&&(n.style.width=`${Math.min(100,Math.max(0,t))}%`)}async function w(e){let t=e.getAverageSatisfaction();S(`tvTotalBeers`,e.getTotalBeers()),S(`tvTotalCost`,`${e.getTotalCost().toFixed(2)}€`),S(`tvTotalVolume`,`${e.getTotalVolume().toFixed(2)}L`),S(`tvAverageSatisfaction`,t===null?`None`:`${t.toFixed(2)}/5`),S(`tvBeersPerDay`,e.getAverageDrinksPerDay().toFixed(2)),S(`tvCostPerDay`,`${e.getAverageCostPerDay().toFixed(2)}€`),S(`tvVolumePerDay`,`${e.getAverageVolumePerDay().toFixed(2)}L`),S(`tvFavoriteBar`,e.getFavoriteBar()),S(`tvFavoriteBrand`,e.getFavoriteBrand()),S(`tvFavoriteHour`,e.getFavoriteHour()),S(`tvMostBar`,e.getMostBar()),S(`tvMostBrand`,e.getMostBrand()),S(`tvMostHour`,e.getMostHour());let n=e.getLongestDrinkingStreak(),r=e.getLongestNonDrinkingStreak(),i=Math.max(n,r,1);S(`tvLongestDrinkingStreak`,`${n} days`),S(`tvLongestNonDrinkingStreak`,`${r} days`),C(`progressDrinkingStreak`,n/i*100),C(`progressSoberStreak`,r/i*100),S(`tvAvgCostPerBeer`,`${e.getAverageCost().toFixed(2)}€`),S(`tvCheapestBeer`,e.getCheapestBeer()),S(`tvMostExpensiveBeer`,e.getMostExpensiveBeer()),S(`tvEstimatedCalories`,`${Math.round(e.getCaloricIntake())} kcal`),S(`tvAlcoholUnits`,`${e.getAlcoholUnits().toFixed(1)} units`);let a=e.compareToWorldsDrinkers();S(`tvCzechiaRatio`,`${a.czechia.toFixed(1)}x`),S(`tvLatviaRatio`,`${a.latvia.toFixed(1)}x`),S(`tvEstoniaRatio`,`${a.estonia.toFixed(1)}x`),S(`tvFranceRatio`,`${a.france.toFixed(1)}x`),S(`tvIrelandRatio`,`${a.ireland.toFixed(1)}x`),S(`tvUSARatio`,`${a.usa.toFixed(1)}x`),S(`tvBangladeshRatio`,`${a.bangladesh.toFixed(1)}x`),C(`barCzechia`,a.czechia*100),C(`barLatvia`,a.latvia*100),C(`barEstonia`,a.estonia*100),C(`barFrance`,a.france*100),C(`barIreland`,a.ireland*100),C(`barUSA`,a.usa*100),C(`barBangladesh`,a.bangladesh*100),S(`tvClosestCountry`,e.getClosestCountry())}async function T(){await w(await y.create(v.ALL_TIME));for(let e of document.querySelectorAll(`.pill`))e.addEventListener(`click`,async()=>{document.querySelectorAll(`.pill`).forEach(e=>e.classList.remove(`active`)),e.classList.add(`active`);let t=E[e.dataset.period]??v.ALL_TIME;await w(await y.create(t))});document.getElementById(`btnAchievements`).addEventListener(`click`,()=>{console.log(`Achievements`)}),document.getElementById(`btnAlcodex`).addEventListener(`click`,()=>{console.log(`Alcodex`)})}var E;e((()=>{i(),a(),b(),E={alltime:v.ALL_TIME,year:v.YEAR,month:v.MONTH,week:v.WEEK}}))();export{x as render};