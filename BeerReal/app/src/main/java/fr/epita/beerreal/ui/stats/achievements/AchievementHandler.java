package fr.epita.beerreal.ui.stats.achievements;

import android.content.Context;
import android.location.Address;
import android.location.Geocoder;
import android.widget.Toast;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.function.Predicate;

import fr.epita.beerreal.MainActivity;
import fr.epita.beerreal.csv.CsvHelper;
import fr.epita.beerreal.csv.Line;
import fr.epita.beerreal.ui.stats.data.Data;
import fr.epita.beerreal.ui.stats.data.Times;

public class AchievementHandler {

    private Data data;

    JSONHelper jsonHelper;

    private Context context;

    public AchievementHandler(Context context) {
        data = new Data(context, Times.ALL_TIME);
        this.context= context;

        jsonHelper = MainActivity.achievements;

        data.SelectTimeToLoad();
    }

    public boolean CheckForNewAchievements(boolean isDeleting) {
        List<Line> allLines = CsvHelper.GetLinesCsv(context);
        boolean newUnlockOrLock = false;

        for (Achievement achievement : jsonHelper.GetAllAchievements()) {
            // When not deleting, skip unlocked achievements (only check locked)
            if (!isDeleting && achievement.Unlocked) continue;

            boolean conditionMet = false;

            switch (achievement.Id) {
                case "Fighter":
                    conditionMet = CheckQuantity(5);
                    break;
                case "Warrior":
                    conditionMet = CheckQuantity(10);
                    break;
                case "War general":
                    conditionMet = CheckQuantity(25);
                    break;
                case "Marathon runner":
                    conditionMet = CheckQuantity(42.195f);
                    break;
                case "The 100th":
                    conditionMet = data.Size >= 100;
                    break;
                case "King of the Keg":
                    conditionMet = any(allLines, l -> l.Volume >= 2.0);
                    break;
                case "Beer week":
                    conditionMet = data.GetLongestDrinkingStreak() >= 7;
                    break;
                case "Alcoholic":
                    conditionMet = data.GetLongestDrinkingStreak() >= 15;
                    break;
                case "Ubermensch":
                    conditionMet = data.GetLongestDrinkingStreak() >= 31;
                    break;
                case "The Trifecta":
                    conditionMet = CheckNumberToday(3);
                    break;
                case "Five pint plan":
                    conditionMet = CheckNumberToday(5);
                    break;
                case "Decapint":
                    conditionMet = CheckNumberToday(10);
                    break;
                case "Where are my glasses?":
                    conditionMet = CheckNumberLast10Minutes();
                    break;
                case "Linked beers":
                    conditionMet = CheckNumberLastMinute();
                    break;
                case "Make day drinking great again":
                    conditionMet = any(allLines, l -> CheckHourPint(l, 8, 12));
                    break;
                case "Night owl":
                    conditionMet = any(allLines, l -> CheckHourPint(l, 0, 3));
                    break;
                case "Vivaldi's beer":
                    conditionMet = CheckVivaldi();
                    break;
                case "Happy Hour Hunter":
                    conditionMet = CheckForAll(5, l -> CheckHourPint(l, 18, 20));
                    break;
                case "What a gift!":
                    conditionMet = any(allLines, l -> l.Price == 0);
                    break;
                case "Money saver":
                    conditionMet = any(allLines, l -> l.Price <= 1 && l.Price > 0);
                    break;
                case "Fancy beer":
                    conditionMet = any(allLines, l -> l.Price >= 10 && l.Price < 20);
                    break;
                case "Gold brew":
                    conditionMet = any(allLines, l -> l.Price >= 20);
                    break;
                case "Price Shock":
                    conditionMet = any(allLines, this::CheckPriceChock);
                    break;
                case "Value Seeker":
                    conditionMet = any(allLines, l -> l.Price <= 1 && l.Rating == 5);
                    break;
                case "Globe trotter":
                    if (!allLines.isEmpty()) {
                        conditionMet = IsGlobeTrotter(context, allLines.get(allLines.size() - 1));
                    }
                    break;
                case "On The Road":
                    if (!allLines.isEmpty()) {
                        conditionMet = CheckOnTheRoad(context, allLines.get(allLines.size() - 1));
                    }
                    break;
                case "Bar Hopper":
                    conditionMet = data.GetUniqueBars() >= 10;
                    break;
                case "Bar Explorer":
                    conditionMet = data.GetUniqueBars() >= 25;
                    break;
                case "Bar Conqueror":
                    conditionMet = data.GetUniqueBars() >= 50;
                    break;
                case "Piss Drinker":
                    conditionMet = any(allLines, l -> l.Rating == 0);
                    break;
                case "Connoisseur":
                    conditionMet = CheckForAll(10, l -> l.Rating >= 4);
                    break;
                case "Critic":
                    conditionMet = CheckForAll(5, l -> l.Rating <= 2);
                    break;
                case "Rising Star":
                    conditionMet = CheckForAll(1, l -> data.IsBrandNew(l.Brand));
                    break;
                case "Santa's Little Helper":
                    conditionMet = any(allLines, l -> GetDay(l, 12, 25));
                    break;
                case "Spooky beer":
                    conditionMet = any(allLines, l -> GetDay(l, 10, 31));
                    break;
                case "Revolution!":
                    conditionMet = any(allLines, l -> GetDay(l, 7, 14));
                    break;
                case "Look! A swallow!":
                    conditionMet = any(allLines, l -> GetDay(l, 3, 21));
                    break;
                case "Cold one on a hot day":
                    conditionMet = any(allLines, l -> GetDay(l, 6, 21));
                    break;
                case "Moderate spender":
                    conditionMet = data.pricesTotal / 2 > 15;
                    break;
                case "Filthy rich":
                    conditionMet = data.pricesTotal / 2 > 50;
                    break;
                case "Life saving on beer":
                    conditionMet = data.pricesTotal / 2 > 100;
                    break;
                case "As rich as Croesus":
                    conditionMet = data.pricesTotal / 2 > 250;
                    break;
                default:
                    throw new IllegalStateException("Unexpected value: " + achievement.Name);
            }

            if (isDeleting) {
                if (achievement.Unlocked != conditionMet) {
                    jsonHelper.SetUnlocked(achievement.Name, conditionMet);
                    newUnlockOrLock = true;
                }
            } else {
                if (conditionMet && !achievement.Unlocked) {
                    jsonHelper.SetUnlocked(achievement.Name, true);
                    newUnlockOrLock = true;
                }
            }
        }

        return newUnlockOrLock;
    }




    private boolean any(List<Line> lines, Predicate<Line> predicate) {
        for (Line l : lines) {
            if (predicate.test(l)) return true;
        }
        return false;
    }


    private boolean CheckForAll(int target, Predicate<Line> predicate) {
        List<Line> lines = CsvHelper.GetLinesCsv(context);

        int count = 0;
        int i = 0;
        while (i < lines.size()) {
            if (predicate.test(lines.get(i))) {
               count++;
            }
            i++;
        }

        return count >= target;
    }


    private boolean CheckPriceChock(Line line) {
        float cheapest = data.GetCheapestBeerPrice();

        return line.Price >= 10 * cheapest;
    }


    // YYYY-MM-DD-HH:mm
    private boolean CheckHourPint(Line line, int targetHourLow, int targetHourHigh) {
        int hour = Integer.parseInt(line.Date.substring(11,13));

        return targetHourLow <= hour && hour <= targetHourHigh;
    }

    private boolean CheckQuantity(float pints) {
        float volume = data.volumeTotal / 2;
        if (data.Size == 0) return false;
        return (volume / 0.5f) >= pints;
    }


    private boolean GetDay(Line line, int targetMonth, int targetDay) {
        int day = Integer.parseInt(line.Date.substring(8,10));
        int month = Integer.parseInt(line.Date.substring(5,7));

        return day == targetDay && month == targetMonth;
    }

    private boolean CheckNumberToday(int targetNumber) {
        List<Line> lines = CsvHelper.GetLinesCsv(context);
        Calendar calendar = Calendar.getInstance();

        int todayDay = calendar.get(Calendar.DAY_OF_MONTH);
        int todayMonth = calendar.get(Calendar.MONTH) + 1;
        int todayYear = calendar.get(Calendar.YEAR);

        int count = 0;

        for (Line l : lines) {
            String date = l.Date;

            int year = Integer.parseInt(date.substring(0, 4));
            int month = Integer.parseInt(date.substring(5, 7));
            int day = Integer.parseInt(date.substring(8, 10));

            if (day == todayDay && month == todayMonth && year == todayYear) {
                count++;
            }
        }

        return count == targetNumber;
    }

    private boolean CheckNumberLast10Minutes() {
        List<Line> lines = CsvHelper.GetLinesCsv(context);
        long now = System.currentTimeMillis();
        int count = 0;

        for (Line l : lines) {
            try {
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd-HH:mm", Locale.getDefault());
                Date lineDate = sdf.parse(l.Date);
                if (lineDate != null) {
                    long diffMillis = now - lineDate.getTime();
                    if (diffMillis > 60 * 1000 && diffMillis <= 10 * 60 * 1000) {
                        count++;
                    }
                }
            } catch (ParseException e) {
                throw new RuntimeException(e);
            }
        }

        return count == 2;
    }

    private boolean CheckNumberLastMinute() {
        List<Line> lines = CsvHelper.GetLinesCsv(context);
        long now = System.currentTimeMillis();
        int count = 0;

        for (Line l : lines) {
            try {
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd-HH:mm", Locale.getDefault());
                Date lineDate = sdf.parse(l.Date);
                if (lineDate != null) {
                    long diffMillis = now - lineDate.getTime();
                    if (diffMillis >= 0 && diffMillis <= 60 * 1000) {
                        count++;
                    }
                }
            } catch (ParseException e) {
                e.printStackTrace();
            }
        }

        return count == 2;
    }

    private boolean CheckVivaldi() {
        List<Line> lines = CsvHelper.GetLinesCsv(context);

        boolean spring = false;
        boolean summer = false;
        boolean fall = false;
        boolean winter = false;

        for (Line l : lines) {
            try {
                String date = l.Date;
                int month = Integer.parseInt(date.substring(5, 7));

                if (month >= 3 && month <= 5) {
                    spring = true;
                } else if (month >= 6 && month <= 8) {
                    summer = true;
                } else if (month >= 9 && month <= 11) {
                    fall = true;
                } else {
                    winter = true;
                }

                if (spring && summer && fall && winter) {
                    return true;
                }

            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        return spring && summer && fall && winter;
    }

    private boolean IsGlobeTrotter(Context context, Line newBeer) {
        ArrayList<Line> lines = CsvHelper.GetLinesCsv(context);
        if (lines.isEmpty()) return false;

        Geocoder geocoder = new Geocoder(context, Locale.getDefault());

        try {
            Line lastBeer = lines.get(lines.size() - 1);

            String homeCountry = GetCountryFromLine(geocoder, lastBeer);
            String newBeerCountry = GetCountryFromLine(geocoder, newBeer);

            if (homeCountry != null && newBeerCountry != null) {
                return !homeCountry.equalsIgnoreCase(newBeerCountry);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        return false;
    }

    private String GetCountryFromLine(Geocoder geocoder, Line line) throws IOException {
        List<Address> addresses = geocoder.getFromLocation(line.Location[0], line.Location[1], 1);
        if (addresses != null && !addresses.isEmpty()) {
            return addresses.get(0).getCountryName();
        }
        return null;
    }

    private boolean CheckOnTheRoad(Context context, Line newBeer) {
        ArrayList<Line> lines = CsvHelper.GetLinesCsv(context);
        if (lines.isEmpty()) return false;

        Line lastBeer = lines.get(lines.size() - 1);

        double distanceKm = haversine(
                lastBeer.Location[0], lastBeer.Location[1],
                newBeer.Location[0], newBeer.Location[1]);

        return distanceKm > 1000;
    }

    private double haversine(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Radius of the Earth in km

        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }

}
