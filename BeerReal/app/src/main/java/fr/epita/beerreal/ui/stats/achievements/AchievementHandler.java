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

    public void CheckForNewAchievements(List<Achievement> achievements, Line line) {
        String name = "";

        for (Achievement achievement : achievements) {
            switch (achievement.Name) {
                case "Fighter": // Drink 5 pints
                    if (CheckQuantity(5)) name += " " + jsonHelper.SetUnlocked("Fighter", true);
                    break;
                case "Warrior": // Drink 10 pints
                    if (CheckQuantity(10)) name += " " + jsonHelper.SetUnlocked("Warrior", true);
                    break;
                case "War general": // Drink 25 pints
                    if (CheckQuantity(25)) name += " " + jsonHelper.SetUnlocked("War general", true);
                    break;
                case "Marathon runner": // Drink 42.195 pints
                    if (CheckQuantity(42.195f)) name += " " + jsonHelper.SetUnlocked("Marathon runner", true);
                    break;
                case "The 100th": // Drink a 100 beers
                    if (data.Size >= 100) name += " " + jsonHelper.SetUnlocked("The 100th", true);
                    break;
                case "King of the Keg": // Drink 2L in one glass
                    if (line.Volume >= 2.0) name += " " + jsonHelper.SetUnlocked("King of the Keg", true);
                    break;
                case "Beer week": // Longest streak of 7
                    if (data.GetLongestDrinkingStreak() >= 7) name += " " + jsonHelper.SetUnlocked("Beer week", true);
                    break;
                case "Alcoholic": // Longest streak of 15
                    if (data.GetLongestDrinkingStreak() >= 15) name += " " + jsonHelper.SetUnlocked("Alcoholic", true);
                    break;
                case "Ubermensch": // Longest streak of 31
                    if (data.GetLongestDrinkingStreak() >= 31) name += " " + jsonHelper.SetUnlocked("Ubermensch", true);
                    break;
                case "The Trifecta": // 3 beers in a day
                    if (CheckNumberToday(3)) name += " " + jsonHelper.SetUnlocked("The Trifecta", true);
                    break;
                case "Five pint plan": // 5 beers in a day
                    if (CheckNumberToday(5)) name += " " + jsonHelper.SetUnlocked("Five pint plan", true);
                    break;
                case "Decapint": // 10 beers in a day
                    if (CheckNumberToday(10)) name += " " + jsonHelper.SetUnlocked("Decapint", true);
                    break;
                case "Where are my glasses?": // 2 beers in 10 minutes
                    if (CheckNumberLast10Minutes()) name += " " + jsonHelper.SetUnlocked("Where are my glasses?", true);
                    break;
                case "Linked beers": // 2 beers in the same minute
                    if (CheckNumberLastMinute()) name += " " + jsonHelper.SetUnlocked("Linked beers", true);
                    break;
                case "Make day drinking great again": // Drink between 8AM and 12AM
                    if (CheckHourPint(line, 8, 12)) name += " " + jsonHelper.SetUnlocked("Make day drinking great again", true);
                    break;
                case "Night owl": // Drink between midnight and 3AM
                    if (CheckHourPint(line, 0, 3)) name += " " + jsonHelper.SetUnlocked("Night owl", true);
                    break;
                case "Vivaldi's beer": // Drink in every seasons
                    if (CheckVivaldi()) name += " " + jsonHelper.SetUnlocked("Vivaldi's beer", true);
                    break;
                case "Happy Hour Hunter": // Drink 5 beers between 6PM to 8PM
                    if (CheckForAll(5, l -> CheckHourPint(l, 18, 20))) name += " " + jsonHelper.SetUnlocked("Happy Hour Hunter", true);
                    break;
                case "What a gift!": // Drink a free beer
                    if (line.Price == 0) name += " " + jsonHelper.SetUnlocked("What a gift!", true);
                    break;
                case "Money saver": // Drink a less than 1€ beer
                    if (line.Price <= 1 && line.Price > 0) name += " " + jsonHelper.SetUnlocked("Money saver", true);
                    break;
                case "Fancy beer": // Drink a more than 10€ beer
                    if (line.Price >= 10 && line.Price < 20) name += " " + jsonHelper.SetUnlocked("Fancy beer", true);
                    break;
                case "Gold brew": // Drink a more than 20€ beer
                    if (line.Price >= 20) name += " " + jsonHelper.SetUnlocked("Gold brew", true);
                    break;
                case "Price Shock": // Drink a beer that costs 10 times more than your cheapest beer
                    if (CheckPriceChock(line)) name += " " + jsonHelper.SetUnlocked("Price Shock", true);
                    break;
                case "Value Seeker": // Drink a beer that costs 10 times more than your cheapest beer
                    if (line.Price <= 1 && line.Rating == 5) name += " " + jsonHelper.SetUnlocked("Value Seeker", true);
                    break;
                case "Globe trotter": // Drink a beer in another country (home country is where you're last beer was registered)
                    if (IsGlobeTrotter(context, line)) name += " " + jsonHelper.SetUnlocked("Globe trotter", true);
                    break;
                case "On The Road": // Drink beer at a latitude difference of 1000+ km from your last beer
                    if (CheckOnTheRoad(context, line)) name += " " + jsonHelper.SetUnlocked("On The Road", true);
                    break;
                case "Bar Hopper": // Drink beers in 10 different bars/locations
                    if (data.GetUniqueBars() >= 10) name += " " + jsonHelper.SetUnlocked("Bar Hopper", true);
                    break;
                case "Bar Explorer": // Drink beers in 25 different bars/locations
                    if (data.GetUniqueBars() >= 25) name += " " + jsonHelper.SetUnlocked("Bar Hopper", true);
                    break;
                case "Bar Conqueror": // Drink beers in 50 different bars/locations
                    if (data.GetUniqueBars() >= 50) name += " " + jsonHelper.SetUnlocked("Bar Hopper", true);
                    break;
                case "Piss Drinker": // Rate a beer 0 stars
                    if (line.Rating == 0) name += " " + jsonHelper.SetUnlocked("Piss Drinker", true);
                    break;
                case "Connoisseur": // Rate 10 beers 4 stars or above
                    if (CheckForAll(10, l -> l.Rating >= 4)) name += " " + jsonHelper.SetUnlocked("Connoisseur", true);
                    break;
                case "Critic": // Rate 5 beers 2 stars or below
                    if (CheckForAll(5, l -> l.Rating <= 2)) name += " " + jsonHelper.SetUnlocked("Connoisseur", true);
                    break;
                case "Rising Star": // Rate a newly discovered beer with 5 stars
                    if (CheckForAll(1, l -> data.IsBrandNew(l.Brand))) name += " " + jsonHelper.SetUnlocked("Connoisseur", true);
                    break;
                case "Santa's Little Helper": // Drink on christmas
                    if (GetDay(line, 12, 25)) name += " " + jsonHelper.SetUnlocked("Santa's Little Helper", true);
                    break;
                case "Spooky beer": // Drink on Halloween
                    if (GetDay(line, 10, 31)) name += " " + jsonHelper.SetUnlocked("Spooky beer", true);
                    break;
                case "Revolution!": // Drink on le 14 Juillet
                    if (GetDay(line, 7, 14)) name += " " + jsonHelper.SetUnlocked("Revolution!", true);
                    break;
                case "Look! A swallow!": // Drink on the first day of spring
                    if (GetDay(line, 3, 21)) name += " " + jsonHelper.SetUnlocked("Look! A swallow!", true);
                    break;
                case "Cold one on a hot day": // Drink on the first day of summer
                    if (GetDay(line, 6, 21)) name += " " + jsonHelper.SetUnlocked("Cold one on a hot day", true);
                    break;
                case "Moderate spender": // Have a total cost of 15€
                    if (data.pricesTotal > 15) name += " " + jsonHelper.SetUnlocked(name, true);
                    break;
                case "Filthy rich": // Have a total cost of 50€
                    if (data.pricesTotal > 50) name += " " + jsonHelper.SetUnlocked(name, true);
                    break;
                case "Life saving on beer": // Have a total cost of 100€
                    if (data.pricesTotal > 100) name += " " + jsonHelper.SetUnlocked(name, true);
                    break;
                case "As rich as Croesus": // Have a total cost of 250€
                    if (data.pricesTotal > 250) name += " " + jsonHelper.SetUnlocked(name, true);
                    break;
                default:
                    throw new IllegalStateException("Unexpected value: " + achievement.Name);
            }
        }

        if (!name.isEmpty()) {
            Toast.makeText(context, "You've unlocked this/these achievement/s:" + name.trim(), Toast.LENGTH_LONG).show();
        }
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

        return R * c; // Distance in km
    }

}
