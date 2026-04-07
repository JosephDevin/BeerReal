import { Data, Times }  from '../data/data.js';
import { getLinesCsv }  from '../storage/csvHelper.js';
import { achievements } from './jsonHelper.js';


// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Check every achievement and unlock/re-lock as appropriate.
 *
 * @param {boolean} isDeleting – pass true when a beer was deleted so already-unlocked json can be re-locked if their
 *                               condition is no longer met.
 * @returns {Promise<string[]>} – names of json that changed state
 */
export async function checkForNewAchievements(isDeleting = false) {
    await achievements.init();

    const [data, allLines] = await Promise.all([
        Data.create(Times.ALL_TIME),
        getLinesCsv(),
    ]);

    const changed = [];

    for (const achievement of achievements.getAllAchievements()) {
        if (!isDeleting && achievement.unlocked) continue;

        let conditionMet = false;

        switch (achievement.id) {

            // ── Volume / count ────────────────────────────────────────────────

            case 'Fighter':         conditionMet = _checkQuantity(data, 5);        break;
            case 'Warrior':         conditionMet = _checkQuantity(data, 10);       break;
            case 'War general':     conditionMet = _checkQuantity(data, 25);       break;
            case 'Marathon runner': conditionMet = _checkQuantity(data, 42.195);   break;
            case 'The 100th':       conditionMet = data.size >= 100;               break;
            case 'King of the Keg': conditionMet = allLines.some(l => l.Volume >= 2.0); break;

            // ── Streaks ───────────────────────────────────────────────────────

            case 'Beer week':   conditionMet = data.getLongestDrinkingStreak() >= 7;  break;
            case 'Alcoholic':   conditionMet = data.getLongestDrinkingStreak() >= 15; break;
            case 'Ubermensch':  conditionMet = data.getLongestDrinkingStreak() >= 31; break;

            // ── Beers per day ─────────────────────────────────────────────────

            case 'The Trifecta':   conditionMet = _checkNumberOnSameDay(allLines, 3);  break;
            case 'Five pint plan': conditionMet = _checkNumberOnSameDay(allLines, 5);  break;
            case 'Decapint':       conditionMet = _checkNumberOnSameDay(allLines, 10); break;

            // ── Time window ───────────────────────────────────────────────────

            case 'Where are my glasses?': conditionMet = _checkNumberLast10Minutes(allLines); break;
            case 'Linked beers':          conditionMet = _checkNumberLastMinute(allLines);     break;

            // ── Time of day ───────────────────────────────────────────────────

            case 'Make day drinking great again':
                conditionMet = allLines.some(l => _checkHourPint(l, 8, 12));
                break;
            case 'Night owl':
                conditionMet = allLines.some(l => _checkHourPint(l, 0, 3));
                break;
            case 'Happy Hour Hunter':
                conditionMet = _checkForAll(allLines, 5, l => _checkHourPint(l, 18, 20));
                break;

            // ── Seasons / calendar ────────────────────────────────────────────

            case "Vivaldi's beer":        conditionMet = _checkVivaldi(allLines);                       break;
            case "Santa's Little Helper": conditionMet = allLines.some(l => _getDay(l, 12, 25));        break;
            case 'Spooky beer':           conditionMet = allLines.some(l => _getDay(l, 10, 31));        break;
            case 'Revolution!':           conditionMet = allLines.some(l => _getDay(l, 7, 14));         break;
            case 'Happy new year!':       conditionMet = allLines.some(l => _getDay(l, 12, 31));        break;
            case 'Look! A swallow!':      conditionMet = allLines.some(l => _getDay(l, 3, 21));         break;
            case 'Cold one on a hot day': conditionMet = allLines.some(l => _getDay(l, 6, 21));         break;

            // ── Price ─────────────────────────────────────────────────────────

            case 'What a gift!':    conditionMet = allLines.some(l => l.Price === 0);                  break;
            case 'Money saver':     conditionMet = allLines.some(l => l.Price <= 1 && l.Price > 0);    break;
            case 'Fancy beer':      conditionMet = allLines.some(l => l.Price >= 10 && l.Price < 20);  break;
            case 'Gold brew':       conditionMet = allLines.some(l => l.Price >= 20);                  break;
            case 'Price Shock':     conditionMet = allLines.some(l => _checkPriceShock(data, l));      break;
            case 'Value Seeker':    conditionMet = allLines.some(l => l.Price <= 1 && l.Rating === 5); break;

            // ── Spending ──────────────────────────────────────────────────────

            case 'Moderate spender':    conditionMet = data.pricesTotal / 2 > 15;  break;
            case 'Filthy rich':         conditionMet = data.pricesTotal / 2 > 50;  break;
            case 'Life saving on beer': conditionMet = data.pricesTotal / 2 > 100; break;
            case 'As rich as Croesus':  conditionMet = data.pricesTotal / 2 > 250; break;

            // ── Rating ────────────────────────────────────────────────────────

            case 'Piss Drinker':  conditionMet = allLines.some(l => l.Rating === 0);           break;
            case 'Connoisseur':   conditionMet = _checkForAll(allLines, 10, l => l.Rating >= 4); break;
            case 'Critic':        conditionMet = _checkForAll(allLines, 5, l => l.Rating <= 2);  break;

            // ── Location ──────────────────────────────────────────────────────

            case 'Bar Hopper':    conditionMet = data.getUniqueBars() >= 10; break;
            case 'Bar Explorer':  conditionMet = data.getUniqueBars() >= 25; break;
            case 'Bar Conqueror': conditionMet = data.getUniqueBars() >= 50; break;
            case 'On The Road':
                if (allLines.length > 0) conditionMet = _checkOnTheRoad(allLines);
                break;

            default:
                console.warn(`AchievementHandler: unknown achievement id "${achievement.id}"`);
                continue;   // don't touch unknown json
        }

        if (isDeleting) {
            // Re-evaluate — can flip in either direction
            if (achievement.unlocked !== conditionMet) {
                await achievements.setUnlocked(achievement.name, conditionMet);
                changed.push(achievement.name);
            }
        } else {
            // Only unlock, never lock
            if (conditionMet && !achievement.unlocked) {
                await achievements.setUnlocked(achievement.name, true);
                changed.push(achievement.name);
            }
        }
    }

    return changed;   // caller decides how to present them
}


// ─────────────────────────────────────────────────────────────────────────────
// PRIVATE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function _checkForAll(lines, target, predicate) {
    return lines.filter(predicate).length >= target;
}

function _checkPriceShock(data, line) {
    const cheapest = data.getCheapestBeerPrice();
    if (cheapest <= 0) return false;
    return line.Price >= 10 * cheapest;
}

/** date format: "YYYY-MM-DD-HH:mm" */
function _checkHourPint(line, low, high) {
    const hour = parseInt(line.Date.substring(11, 13), 10);
    return hour >= low && hour <= high;
}

function _checkQuantity(data, pints) {
    if (data.size === 0) return false;
    return (data.volumeTotal / 2 / 0.5) >= pints;
}

function _getDay(line, targetMonth, targetDay) {
    const day   = parseInt(line.Date.substring(8, 10), 10);
    const month = parseInt(line.Date.substring(5, 7),  10);
    return day === targetDay && month === targetMonth;
}

function _checkNumberOnSameDay(lines, targetNumber) {
    const counts = {};
    for (const l of lines) {
        if (!l.Date) continue;
        const raw = l.Date.trim();
        if (raw.length < 10) continue;
        const date = raw.substring(0, 10);
        counts[date] = (counts[date] ?? 0) + 1;
    }
    return Object.values(counts).some(c => c >= targetNumber);
}

function _checkNumberLast10Minutes(lines) {
    const now = Date.now();
    let count = 0;
    for (const l of lines) {
        const d = _parseDate(l.Date);
        if (!d) continue;
        const diff = now - d.getTime();
        if (diff >= 0 && diff <= 10 * 60 * 1000) count++;
    }
    return count >= 2;
}

function _checkNumberLastMinute(lines) {
    const now = Date.now();
    let count = 0;
    for (const l of lines) {
        const d = _parseDate(l.Date);
        if (!d) continue;
        const diff = now - d.getTime();
        if (diff >= 0 && diff <= 60 * 1000) count++;
    }
    return count >= 2;
}

function _checkVivaldi(lines) {
    let spring = false, summer = false, fall = false, winter = false;
    for (const l of lines) {
        try {
            const month = parseInt(l.Date.substring(5, 7), 10);
            if      (month >= 3  && month <= 5)  spring = true;
            else if (month >= 6  && month <= 8)  summer = true;
            else if (month >= 9  && month <= 11) fall   = true;
            else                                 winter = true;
            if (spring && summer && fall && winter) return true;
        } catch (e) {
            console.error(e);
        }
    }
    return spring && summer && fall && winter;
}


function _checkOnTheRoad(allLines) {
    if (allLines.length < 2) return false;
    for (let i = 0; i < allLines.length; i++) {
        for (let j = i + 1; j < allLines.length; j++) {
            if (_haversine(
                allLines[i].Location[0], allLines[i].Location[1],
                allLines[j].Location[0], allLines[j].Location[1]
            ) > 1000) return true;
        }
    }
    return false;
}

function _haversine(lat1, lon1, lat2, lon2) {
    const R    = 6371;
    const dLat = _toRad(lat2 - lat1);
    const dLon = _toRad(lon2 - lon1);
    const a    =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(_toRad(lat1)) * Math.cos(_toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function _toRad(deg) { return deg * (Math.PI / 180); }

/** Parses "YYYY-MM-DD-HH:mm" → JS Date */
function _parseDate(str) {
    if (!str) return null;
    try {
        // "2024-06-15-21:30" → "2024-06-15T21:30"
        return new Date(str.substring(0, 10) + 'T' + str.substring(11));
    } catch {
        return null;
    }
}