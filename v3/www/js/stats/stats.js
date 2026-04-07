import { t } from '../../assets/strings/strings.js';
import '../../css/stats/stats.css';
import '../../css/stats/achievements/achievements.css';
import { Data, Times }              from './data/data';
import { openAchievementsDialog }   from './achievements/achievementDialog.js';
import {checkForNewAchievements} from "./achievements/achievementHandler";
import {openAlcodexDialog}                from "./alcodex/alcodexDialog";
import { triggerExport, openImportDialog } from './backup/backupDialog.js';

export function render(container) {
    container.innerHTML = `
    <div id="page-stats">

      <div id="stats-scroll">

        <!-- ── PILL SEGMENT SELECTOR ── -->
        <div class="pill-scroll">
          <div class="pill-container">
            <div class="pill active" data-period="alltime">${t.all_time}</div>
            <div class="pill"        data-period="year">${t.year}</div>
            <div class="pill"        data-period="month">${t.month}</div>
            <div class="pill"        data-period="week">${t.week}</div>
          </div>
        </div>

        <!-- ── TOTALS ── -->
        <div class="section-header">
          <div class="bar"></div>
          <h2>${t.totals}</h2>
        </div>

        <div class="card-row mb-20">
          <div class="stat-card">
            <div class="stat-label">${t.total_beers}</div>
            <div class="stat-value" id="tvTotalBeers">—</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">${t.total_cost}</div>
            <div class="stat-value amber" id="tvTotalCost">—</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">${t.total_volume}</div>
            <div class="stat-value" id="tvTotalVolume">—</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">${t.average_satisfaction}</div>
            <div class="stat-value" id="tvAverageSatisfaction">—</div>
          </div>
        </div>

        <!-- ── DAILY AVERAGES ── -->
        <div class="section-header">
          <div class="bar"></div>
          <h2>${t.daily_averages}</h2>
        </div>

        <div class="card-row">
          <div class="stat-card">
            <div class="stat-label">${t.beers_day}</div>
            <div class="stat-value" id="tvBeersPerDay">—</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">${t.cost_day}</div>
            <div class="stat-value amber" id="tvCostPerDay">—</div>
          </div>
        </div>

        <div class="card-full mb-20">
          <div class="stat-card">
            <div class="stat-label">${t.volume_day}</div>
            <div class="stat-value" id="tvVolumePerDay">—</div>
          </div>
        </div>

        <!-- ── FAVORITES ── -->
        <div class="section-header">
          <div class="bar"></div>
          <h2>${t.favorites}</h2>
        </div>

        <div class="card-full">
          <div class="stat-card">
            <div class="stat-label">${t.bar_fav}</div>
            <div class="stat-value medium" id="tvFavoriteBar">—</div>
          </div>
        </div>

        <div class="card-row mb-20">
          <div class="stat-card">
            <div class="stat-label">${t.brand_fav}</div>
            <div class="stat-value small" id="tvFavoriteBrand">—</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">${t.hour_fav}</div>
            <div class="stat-value small" id="tvFavoriteHour">—</div>
          </div>
        </div>

        <!-- ── MOST DRINKS ── -->
        <div class="section-header">
          <div class="bar"></div>
          <h2>${t.most_drinks}</h2>
        </div>

        <div class="card-full">
          <div class="stat-card">
            <div class="stat-label">${t.bar_most}</div>
            <div class="stat-value medium" id="tvMostBar">—</div>
          </div>
        </div>

        <div class="card-row mb-20">
          <div class="stat-card">
            <div class="stat-label">${t.brand_most}</div>
            <div class="stat-value small" id="tvMostBrand">—</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">${t.hour_most}</div>
            <div class="stat-value small" id="tvMostHour">—</div>
          </div>
        </div>

        <!-- ── STREAKS ── -->
        <div class="section-header">
          <div class="bar"></div>
          <h2>${t.streaks}</h2>
        </div>

        <div class="card-full">
          <div class="stat-card">
            <div class="progress-row">
              <span class="progress-label">${t.longest_drinking_streak}</span>
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
              <span class="progress-label">${t.longest_sober_streak}</span>
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
          <h2>${t.cost_breakdown}</h2>
        </div>

        <div class="card-row">
          <div class="stat-card">
            <div class="stat-label">${t.avg_beer}</div>
            <div class="stat-value cost amber" id="tvAvgCostPerBeer">—</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">${t.cheapest}</div>
            <div class="stat-value xsmall green" id="tvCheapestBeer">—</div>
          </div>
        </div>

        <div class="card-full mb-20">
          <div class="stat-card">
            <div class="stat-label">${t.most_expensive}</div>
            <div class="stat-value small" id="tvMostExpensiveBeer">—</div>
          </div>
        </div>

        <!-- ── HEALTH METRICS ── -->
        <div class="section-header">
          <div class="bar"></div>
          <h2>${t.health_metrics}</h2>
        </div>

        <div class="card-row mb-20">
          <div class="stat-card">
            <div class="stat-label">${t.estimated_calories}</div>
            <div class="stat-value cost" id="tvEstimatedCalories">—</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">${t.alcohol_units}</div>
            <div class="stat-value cost" id="tvAlcoholUnits">—</div>
          </div>
        </div>

        <!-- ── GLOBAL COMPARISON ── -->
        <div class="section-header">
          <div class="bar"></div>
          <h2>${t.global_comparison}</h2>
        </div>

        <div class="card-full">
          <div class="stat-card" id="countryComparisonContainer">

            <div class="country-row">
              <div class="progress-row">
                <span class="progress-label">${t.czechia}</span>
                <span class="progress-value" id="tvCzechiaRatio">—x</span>
              </div>
              <div class="progress-track"><div class="progress-fill" id="barCzechia"></div></div>
            </div>

            <div class="country-row">
              <div class="progress-row">
                <span class="progress-label">${t.latvia}</span>
                <span class="progress-value" id="tvLatviaRatio">—x</span>
              </div>
              <div class="progress-track"><div class="progress-fill" id="barLatvia"></div></div>
            </div>

            <div class="country-row">
              <div class="progress-row">
                <span class="progress-label">${t.estonia}</span>
                <span class="progress-value" id="tvEstoniaRatio">—x</span>
              </div>
              <div class="progress-track"><div class="progress-fill" id="barEstonia"></div></div>
            </div>

            <div class="country-row">
              <div class="progress-row">
                <span class="progress-label">${t.france}</span>
                <span class="progress-value" id="tvFranceRatio">—x</span>
              </div>
              <div class="progress-track"><div class="progress-fill" id="barFrance"></div></div>
            </div>

            <div class="country-row">
              <div class="progress-row">
                <span class="progress-label">${t.ireland}</span>
                <span class="progress-value" id="tvIrelandRatio">—x</span>
              </div>
              <div class="progress-track"><div class="progress-fill" id="barIreland"></div></div>
            </div>

            <div class="country-row">
              <div class="progress-row">
                <span class="progress-label">${t.usa}</span>
                <span class="progress-value" id="tvUSARatio">—x</span>
              </div>
              <div class="progress-track"><div class="progress-fill" id="barUSA"></div></div>
            </div>

            <div class="country-row">
              <div class="progress-row">
                <span class="progress-label">${t.bangladesh}</span>
                <span class="progress-value" id="tvBangladeshRatio">—x</span>
              </div>
              <div class="progress-track"><div class="progress-fill" id="barBangladesh"></div></div>
            </div>

          </div>
        </div>

        <div class="card-full mb-20">
          <div class="stat-card">
            <div class="stat-label">${t.you_drink_most_like}</div>
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
  `;

    initStats();
}


// ── PILL → Times mapping ──────────────────────────────────────────────────────

const PERIOD_MAP = {
    alltime: Times.ALL_TIME,
    year:    Times.YEAR,
    month:   Times.MONTH,
    week:    Times.WEEK,
};


// ── POPULATE DOM ──────────────────────────────────────────────────────────────

function set(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

function setBar(id, pct) {
    const el = document.getElementById(id);
    if (el) el.style.width = `${Math.min(100, Math.max(0, pct))}%`;
}

async function populateStats(data) {
    // Totals
    const satisfaction = data.getAverageSatisfaction();
    set('tvTotalBeers',          data.getTotalBeers());
    set('tvTotalCost',           `${data.getTotalCost().toFixed(2)}€`);
    set('tvTotalVolume',         `${data.getTotalVolume().toFixed(2)}L`);
    set('tvAverageSatisfaction', satisfaction === null ? t.none : `${satisfaction.toFixed(2)}/5`);

    // Daily averages
    set('tvBeersPerDay',  data.getAverageDrinksPerDay().toFixed(2));
    set('tvCostPerDay',   `${data.getAverageCostPerDay().toFixed(2)}€`);
    set('tvVolumePerDay', `${data.getAverageVolumePerDay().toFixed(2)}L`);

    // Favorites
    set('tvFavoriteBar',   data.getFavoriteBar());
    set('tvFavoriteBrand', data.getFavoriteBrand());
    set('tvFavoriteHour',  data.getFavoriteHour());

    // Most
    set('tvMostBar',   data.getMostBar());
    set('tvMostBrand', data.getMostBrand());
    set('tvMostHour',  data.getMostHour());

    // Streaks
    const drinkStreak = data.getLongestDrinkingStreak();
    const soberStreak = data.getLongestNonDrinkingStreak();
    const maxStreak   = Math.max(drinkStreak, soberStreak, 1);

    set('tvLongestDrinkingStreak',    `${drinkStreak} ${t.days}`);
    set('tvLongestNonDrinkingStreak', `${soberStreak} ${t.days}`);
    setBar('progressDrinkingStreak', (drinkStreak / maxStreak) * 100);
    setBar('progressSoberStreak',    (soberStreak / maxStreak) * 100);

    // Cost
    set('tvAvgCostPerBeer',    `${data.getAverageCost().toFixed(2)}€`);
    set('tvCheapestBeer',      data.getCheapestBeer());
    set('tvMostExpensiveBeer', data.getMostExpensiveBeer());

    // Health
    set('tvEstimatedCalories', `${Math.round(data.getCaloricIntake())} kcal`);
    set('tvAlcoholUnits',      `${data.getAlcoholUnits().toFixed(1)} ${t.units}`);

    // Global comparison
    const r = data.compareToWorldsDrinkers();

    set('tvCzechiaRatio',    `${r.czechia.toFixed(1)}x`);
    set('tvLatviaRatio',     `${r.latvia.toFixed(1)}x`);
    set('tvEstoniaRatio',    `${r.estonia.toFixed(1)}x`);
    set('tvFranceRatio',     `${r.france.toFixed(1)}x`);
    set('tvIrelandRatio',    `${r.ireland.toFixed(1)}x`);
    set('tvUSARatio',        `${r.usa.toFixed(1)}x`);
    set('tvBangladeshRatio', `${r.bangladesh.toFixed(1)}x`);

    setBar('barCzechia',    r.czechia    * 100);
    setBar('barLatvia',     r.latvia     * 100);
    setBar('barEstonia',    r.estonia    * 100);
    setBar('barFrance',     r.france     * 100);
    setBar('barIreland',    r.ireland    * 100);
    setBar('barUSA',        r.usa        * 100);
    setBar('barBangladesh', r.bangladesh * 100);

    set('tvClosestCountry', data.getClosestCountry());
}


// ── INIT ──────────────────────────────────────────────────────────────────────

async function initStats() {
    // Load and display default period (ALL_TIME)
    const defaultData = await Data.create(Times.ALL_TIME);
    await populateStats(defaultData);

    checkForNewAchievements(false).catch(console.error);

    // Pill switching
    for (const pill of document.querySelectorAll('.pill')) {
        pill.addEventListener('click', async () => {
            document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            const time = PERIOD_MAP[pill.dataset.period] ?? Times.ALL_TIME;
            const data = await Data.create(time);
            await populateStats(data);
        });
    }

    // ── Achievements button ───────────────────────────────────────────────────
    document.getElementById('btnAchievements').addEventListener('click', () => {
        openAchievementsDialog();
    });

    document.getElementById('btnAlcodex').addEventListener('click', () => {
        openAlcodexDialog();
    });

    const exportBtn = document.getElementById('btnExportBackup');
    const importBtn = document.getElementById('btnImportBackup');

    exportBtn.addEventListener('click', () => triggerExport(exportBtn));
    importBtn.addEventListener('click', () => openImportDialog());
}