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

    public String CheckForNewAchievements(List<Achievement> achievements) {
        List<Line> allLines = CsvHelper.GetLinesCsv(context);
        StringBuilder name = new StringBuilder();

        for (Achievement achievement : achievements) {
            switch (achievement.Name) {
                case "Fighter":
                    name.append(" ").append(jsonHelper.SetUnlocked("Fighter", CheckQuantity(5)));
                    break;
                case "Warrior":
                    name.append(" ").append(jsonHelper.SetUnlocked("Warrior", CheckQuantity(10)));
                    break;
                case "War general":
                    name.append(" ").append(jsonHelper.SetUnlocked("War general", CheckQuantity(25)));
                    break;
                case "Marathon runner":
                    name.append(" ").append(jsonHelper.SetUnlocked("Marathon runner", CheckQuantity(42.195f)));
                    break;
                case "The 100th":
                    name.append(" ").append(jsonHelper.SetUnlocked("The 100th", data.Size >= 100));
                    break;
                case "King of the Keg":
                    // Check if ANY line has volume >= 2.0
                    boolean kingOfKeg = false;
                    for (Line l : allLines) {
                        if (l.Volume >= 2.0) {
                            kingOfKeg = true;
                            break;
                        }
                    }
                    name.append(" ").append(jsonHelper.SetUnlocked("King of the Keg", kingOfKeg));
                    break;
                case "Beer week":
                    name.append(" ").append(jsonHelper.SetUnlocked("Beer week", data.GetLongestDrinkingStreak() >= 7));
                    break;
                case "Alcoholic":
                    name.append(" ").append(jsonHelper.SetUnlocked("Alcoholic", data.GetLongestDrinkingStreak() >= 15));
                    break;
                case "Ubermensch":
                    name.append(" ").append(jsonHelper.SetUnlocked("Ubermensch", data.GetLongestDrinkingStreak() >= 31));
                    break;
                case "The Trifecta":
                    name.append(" ").append(jsonHelper.SetUnlocked("The Trifecta", CheckNumberToday(3)));
                    break;
                case "Five pint plan":
                    name.append(" ").append(jsonHelper.SetUnlocked("Five pint plan", CheckNumberToday(5)));
                    break;
                case "Decapint":
                    name.append(" ").append(jsonHelper.SetUnlocked("Decapint", CheckNumberToday(10)));
                    break;
                case "Where are my glasses?":
                    name.append(" ").append(jsonHelper.SetUnlocked("Where are my glasses?", CheckNumberLast10Minutes()));
                    break;
                case "Linked beers":
                    name.append(" ").append(jsonHelper.SetUnlocked("Linked beers", CheckNumberLastMinute()));
                    break;
                case "Make day drinking great again":
                    // Check if any line in time range 8-12
                    boolean makeDayDrinking = false;
                    for (Line l : allLines) {
                        if (CheckHourPint(l, 8, 12)) {
                            makeDayDrinking = true;
                            break;
                        }
                    }
                    name.append(" ").append(jsonHelper.SetUnlocked("Make day drinking great again", makeDayDrinking));
                    break;
                case "Night owl":
                    // Check if any line in time range 0-3
                    boolean nightOwl = false;
                    for (Line l : allLines) {
                        if (CheckHourPint(l, 0, 3)) {
                            nightOwl = true;
                            break;
                        }
                    }
                    name.append(" ").append(jsonHelper.SetUnlocked("Night owl", nightOwl));
                    break;
                case "Vivaldi's beer":
                    name.append(" ").append(jsonHelper.SetUnlocked("Vivaldi's beer", CheckVivaldi()));
                    break;
                case "Happy Hour Hunter":
                    name.append(" ").append(jsonHelper.SetUnlocked("Happy Hour Hunter", CheckForAll(5, l -> CheckHourPint(l, 18, 20))));
                    break;
                case "What a gift!":
                    // Any free line?
                    boolean gift = false;
                    for (Line l : allLines) {
                        if (l.Price == 0) {
                            gift = true;
                            break;
                        }
                    }
                    name.append(" ").append(jsonHelper.SetUnlocked("What a gift!", gift));
                    break;
                case "Money saver":
                    // Any line price <=1 and >0
                    boolean moneySaver = false;
                    for (Line l : allLines) {
                        if (l.Price <= 1 && l.Price > 0) {
                            moneySaver = true;
                            break;
                        }
                    }
                    name.append(" ").append(jsonHelper.SetUnlocked("Money saver", moneySaver));
                    break;
                case "Fancy beer":
                    // Any line price 10 <= price < 20
                    boolean fancyBeer = false;
                    for (Line l : allLines) {
                        if (l.Price >= 10 && l.Price < 20) {
                            fancyBeer = true;
                            break;
                        }
                    }
                    name.append(" ").append(jsonHelper.SetUnlocked("Fancy beer", fancyBeer));
                    break;
                case "Gold brew":
                    // Any line price >= 20
                    boolean goldBrew = false;
                    for (Line l : allLines) {
                        if (l.Price >= 20) {
                            goldBrew = true;
                            break;
                        }
                    }
                    name.append(" ").append(jsonHelper.SetUnlocked("Gold brew", goldBrew));
                    break;
                case "Price Shock":
                    // Any line satisfies price shock
                    boolean priceShock = false;
                    for (Line l : allLines) {
                        if (CheckPriceChock(l)) {
                            priceShock = true;
                            break;
                        }
                    }
                    name.append(" ").append(jsonHelper.SetUnlocked("Price Shock", priceShock));
                    break;
                case "Value Seeker":
                    // Any line price <=1 and rating == 5
                    boolean valueSeeker = false;
                    for (Line l : allLines) {
                        if (l.Price <= 1 && l.Rating == 5) {
                            valueSeeker = true;
                            break;
                        }
                    }
                    name.append(" ").append(jsonHelper.SetUnlocked("Value Seeker", valueSeeker));
                    break;
                case "Globe trotter":
                    // Check if last line and new line different country?
                    if (!allLines.isEmpty()) {
                        Line lastLine = allLines.get(allLines.size() - 1);
                        name.append(" ").append(jsonHelper.SetUnlocked("Globe trotter", IsGlobeTrotter(context, lastLine)));
                    }
                    break;
                case "On The Road":
                    if (!allLines.isEmpty()) {
                        Line lastLine = allLines.get(allLines.size() - 1);
                        name.append(" ").append(jsonHelper.SetUnlocked("On The Road", CheckOnTheRoad(context, lastLine)));
                    }
                    break;
                case "Bar Hopper":
                    name.append(" ").append(jsonHelper.SetUnlocked("Bar Hopper", data.GetUniqueBars() >= 10));
                    break;
                case "Bar Explorer":
                    name.append(" ").append(jsonHelper.SetUnlocked("Bar Explorer", data.GetUniqueBars() >= 25));
                    break;
                case "Bar Conqueror":
                    name.append(" ").append(jsonHelper.SetUnlocked("Bar Conqueror", data.GetUniqueBars() >= 50));
                    break;
                case "Piss Drinker":
                    // Any line rating == 0
                    boolean pissDrinker = false;
                    for (Line l : allLines) {
                        if (l.Rating == 0) {
                            pissDrinker = true;
                            break;
                        }
                    }
                    name.append(" ").append(jsonHelper.SetUnlocked("Piss Drinker", pissDrinker));
                    break;
                case "Connoisseur":
                    name.append(" ").append(jsonHelper.SetUnlocked("Connoisseur", CheckForAll(10, l -> l.Rating >= 4)));
                    break;
                case "Critic":
                    name.append(" ").append(jsonHelper.SetUnlocked("Critic", CheckForAll(5, l -> l.Rating <= 2)));
                    break;
                case "Rising Star":
                    name.append(" ").append(jsonHelper.SetUnlocked("Rising Star", CheckForAll(1, l -> data.IsBrandNew(l.Brand))));
                    break;
                case "Santa's Little Helper":
                    // Any line on 12/25
                    boolean santaHelper = false;
                    for (Line l : allLines) {
                        if (GetDay(l, 12, 25)) {
                            santaHelper = true;
                            break;
                        }
                    }
                    name.append(" ").append(jsonHelper.SetUnlocked("Santa's Little Helper", santaHelper));
                    break;
                case "Spooky beer":
                    // Any line on 10/31
                    boolean spookyBeer = false;
                    for (Line l : allLines) {
                        if (GetDay(l, 10, 31)) {
                            spookyBeer = true;
                            break;
                        }
                    }
                    name.append(" ").append(jsonHelper.SetUnlocked("Spooky beer", spookyBeer));
                    break;
                case "Revolution!":
                    // Any line on 7/14
                    boolean revolution = false;
                    for (Line l : allLines) {
                        if (GetDay(l, 7, 14)) {
                            revolution = true;
                            break;
                        }
                    }
                    name.append(" ").append(jsonHelper.SetUnlocked("Revolution!", revolution));
                    break;
                case "Look! A swallow!":
                    // Any line on 3/21
                    boolean swallow = false;
                    for (Line l : allLines) {
                        if (GetDay(l, 3, 21)) {
                            swallow = true;
                            break;
                        }
                    }
                    name.append(" ").append(jsonHelper.SetUnlocked("Look! A swallow!", swallow));
                    break;
                case "Cold one on a hot day":
                    // Any line on 6/21
                    boolean coldOne = false;
                    for (Line l : allLines) {
                        if (GetDay(l, 6, 21)) {
                            coldOne = true;
                            break;
                        }
                    }
                    name.append(" ").append(jsonHelper.SetUnlocked("Cold one on a hot day", coldOne));
                    break;
                case "Moderate spender":
                    name.append(" ").append(jsonHelper.SetUnlocked("Moderate spender", data.pricesTotal / 2 > 15));
                    break;
                case "Filthy rich":
                    name.append(" ").append(jsonHelper.SetUnlocked("Filthy rich", data.pricesTotal / 2 > 50));
                    break;
                case "Life saving on beer":
                    name.append(" ").append(jsonHelper.SetUnlocked("Life saving on beer", data.pricesTotal / 2> 100));
                    break;
                case "As rich as Croesus":
                    name.append(" ").append(jsonHelper.SetUnlocked("As rich as Croesus", data.pricesTotal / 2 > 250));
                    break;
                default:
                    throw new IllegalStateException("Unexpected value: " + achievement.Name);
            }
        }

        System.out.println(data.pricesTotal);
        return name.toString();
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
