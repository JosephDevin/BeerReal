package fr.epita.beerreal;

import android.content.Context;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import fr.epita.beerreal.csv.CsvHelper;
import fr.epita.beerreal.csv.Line;

public class Data {

    private final List<Line> Lines;
    private final Times _time;

    private List<String> Brands;
    private List<Float> Volumes;
    private List<Float> Prices;
    private List<String> Dates;
    private List<String> Bars;
    private List<Float> Ratings;




    private int Size;
    private float pricesTotal;
    private float volumeTotal;
    private int uniqueDays;

    public int Days;




    public Data(Context context, Times time) {
        Lines = CsvHelper.GetLinesCsv(context);
        _time = time;

        Brands = new ArrayList<>();
        Volumes = new ArrayList<>();
        Prices = new ArrayList<>();
        Dates = new ArrayList<>();
        Bars = new ArrayList<>();
        Ratings = new ArrayList<>();

        switch (time) {
            case WEEK:
                Days = CsvHelper.getDaysSoFarThisWeek();
                break;
            case MONTH:
                Days = CsvHelper.getDaysSoFarThisMonth();
                break;
            case YEAR:
                Days = CsvHelper.getDaysSoFarThisYear();
                break;
            case ALL_TIME:
                Days = CsvHelper.getDaysFromEarliestDate(context);
        }

        SelectTimeToLoad();
    }

    public void SelectTimeToLoad() {
        switch (_time) {
            case WEEK:
                LoadAllLinesIntoData(LinesThisWeek());
                break;
            case MONTH:
                LoadAllLinesIntoData(LinesThisMonth());
                break;
            case YEAR:
                LoadAllLinesIntoData(LinesThisYear());
                break;
            case ALL_TIME:
                LoadAllLinesIntoData(Lines);
                break;
        }
    }

    public void LoadAllLinesIntoData(List<Line> lines) {

        for (Line l:lines) {
            Size += 1;

            Brands.add(l.Brand);
            Volumes.add(l.Volume);
            Prices.add(l.Price);
            Dates.add(l.Date);
            Bars.add(l.Bar);
            Ratings.add(l.Rating);
        }

        pricesTotal = DataHelper.Sum(Prices);
        volumeTotal = DataHelper.Sum(Volumes);
        uniqueDays = DataHelper.CountUniqueDays(Dates);
    }


    // DATA POINT:

    // TOTALS
    public int GetTotalBeers() { return Size; }
    public float GetTotalCost() { return pricesTotal; }
    public float GetTotalVolume() { return volumeTotal; }
    public float GetAverageSatisfaction() { return DataHelper.Sum(Ratings)/Size; }



    // AVERAGE PER DAY:

    public float GetAverageDrinksPerDay() {
        if (uniqueDays == 0) return 0;
        return (float) Size / Days;
    }

    public float GetAverageCostPerDay() {
        if (uniqueDays == 0) return 0;
        return pricesTotal / Days;
    }

    public float GetAverageVolumePerDay() {
        if (uniqueDays == 0) return 0;
        return volumeTotal / Days;
    }

    // FAVORITES:
    public String GetFavoriteBar() { return DataHelper.GetFavorite(Bars); }
    public String GetFavoriteBrand() { return DataHelper.GetFavorite(Brands); }

    public String GetFavoriteHour() {
        List<String> hours = new ArrayList<>();

        for (int i = 0; i < Dates.size(); i++) {
            String date = Dates.get(i);
            String[] parts = date.split("-");
            if (parts.length >= 4) {
                String hourPart = parts[3];
                if (hourPart.length() >= 2) {
                    hours.add(hourPart.substring(0, 2));
                }
            }
        }
        return DataHelper.GetFavorite(hours);
    }



    // COST:
    public float GetAverageCost() { return pricesTotal / Size; }
    public String GetCheapestBeer() {
        if (Lines == null || Lines.isEmpty()) return "N/A";

        Line cheapest = null;

        for (int i = 0; i < Lines.size(); i++) {
            Line l = Lines.get(i);
            if (cheapest == null || l.Price < cheapest.Price) {
                cheapest = l;
            }
        }

        return String.format(Locale.FRANCE,
                "%.2f€ - %s @ %s",
                cheapest.Price,
                cheapest.Brand.trim(),
                cheapest.Bar.trim());
    }

    public String GetMostExpensiveBeer() {
        if (Lines == null || Lines.isEmpty()) return "N/A";

        Line expensive = null;

        for (int i = 0; i < Lines.size(); i++) {
            Line l = Lines.get(i);
            if (expensive == null || l.Price > expensive.Price) {
                expensive = l;
            }
        }

        return String.format(Locale.FRANCE,
                "%.2f€ - %s @ %s",
                expensive.Price,
                expensive.Brand.trim(),
                expensive.Bar.trim());
    }

    // STREAKS
    private final int[] streaks = DataHelper.GetDrinkingStreak(Dates);

    public int GetLongestDrinkingStreak() {
        return streaks[0];
    }

    public int GetLongestNonDrinkingStreak() {
        return streaks[1];
    }


    // HEALTH RELATED:
    public float GetCaloricIntakeFromBeer() { return volumeTotal/0.5f * 215.4f;}
    public float GetAlcoholUnitsConsumed() { return (volumeTotal/0.5f) * 2.4f;}


    // NATIONALITY
    public float[] CompareToWorldsDrinkers() {
        float[] res = new float[7];

        float yourConsumption = GetAlcoholUnitsConsumed() / Days;

        float RomaniaConsumption = DataHelper.AverageConsumptionByDay(17.06f);
        float GeorgianConsumption = DataHelper.AverageConsumptionByDay(15.54f);
        float LatvianConsumption = DataHelper.AverageConsumptionByDay(14.73f);

        float FrenchConsumption = DataHelper.AverageConsumptionByDay(11.76f);
        float IrishConsumption = DataHelper.AverageConsumptionByDay(10.5f);
        float AmericanConsumption = DataHelper.AverageConsumptionByDay(9.47f);

        float BangladeshConsumption = DataHelper.AverageConsumptionByDay(0.01f);

        res[0] = yourConsumption/RomaniaConsumption;
        res[1] = yourConsumption/GeorgianConsumption;
        res[2] = yourConsumption/LatvianConsumption;
        res[3] = yourConsumption/FrenchConsumption;
        res[4] = yourConsumption/IrishConsumption;
        res[5] = yourConsumption/AmericanConsumption;
        res[6] = yourConsumption/BangladeshConsumption;


        return res;
    }

    public String ClosestComparison(Context context) throws JSONException, IOException {
        double targetValue = GetAlcoholUnitsConsumed() / Days;

        InputStream is = context.getResources().openRawResource(R.raw.country_values);
        BufferedReader reader = new BufferedReader(new InputStreamReader(is));
        StringBuilder builder = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            builder.append(line);
        }

        String jsonString = builder.toString();

        JSONArray jsonArray = new JSONArray(jsonString);
        String closestCountry = "";
        double smallestDiff = Double.MAX_VALUE;

        for (int i = 0; i < jsonArray.length(); i++) {
            JSONObject obj = jsonArray.getJSONObject(i);
            String country = obj.getString("country");
            double value = obj.getDouble("value");

            double diff = Math.abs(value - targetValue);
            if (diff < smallestDiff) {
                smallestDiff = diff;
                closestCountry = country;
            }
        }

        return closestCountry;
    }






    // LOAD DATA BY SPECIFIC TIME
    public List<Line> LinesThisWeek() {
        List<Line> linesThisWeek = new ArrayList<>();
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd-HH:mm", Locale.FRANCE);
        Calendar now = Calendar.getInstance();
        int currentWeek = now.get(Calendar.WEEK_OF_YEAR);
        int currentYear = now.get(Calendar.YEAR);

        for (Line line : Lines) {
            try {
                Date date = dateFormat.parse(line.Date);
                Calendar cal = Calendar.getInstance();
                cal.setTime(date);

                int lineWeek = cal.get(Calendar.WEEK_OF_YEAR);
                int lineYear = cal.get(Calendar.YEAR);

                if (lineWeek == currentWeek && lineYear == currentYear) {
                    linesThisWeek.add(line);
                }
            } catch (ParseException e) {
                throw new RuntimeException(e);
            }
        }

        return linesThisWeek;
    }

    public List<Line> LinesThisMonth() {
        List<Line> linesThisMonth = new ArrayList<>();
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd-HH:mm", Locale.FRANCE);
        Calendar now = Calendar.getInstance();
        int currentMonth = now.get(Calendar.MONTH); // 0-based (January = 0)
        int currentYear = now.get(Calendar.YEAR);

        for (Line line : Lines) {
            try {
                Date date = dateFormat.parse(line.Date);
                Calendar cal = Calendar.getInstance();
                cal.setTime(date);

                int lineMonth = cal.get(Calendar.MONTH);
                int lineYear = cal.get(Calendar.YEAR);

                if (lineMonth == currentMonth && lineYear == currentYear) {
                    linesThisMonth.add(line);
                }
            } catch (ParseException e) {
                throw new RuntimeException(e);
            }
        }

        return linesThisMonth;
    }

    public List<Line> LinesThisYear() {
        List<Line> linesThisYear = new ArrayList<>();
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd-HH:mm", Locale.FRANCE);
        int currentYear = Calendar.getInstance().get(Calendar.YEAR);

        for (Line line : Lines) {
            try {
                Date date = dateFormat.parse(line.Date);
                Calendar cal = Calendar.getInstance();
                cal.setTime(date);

                int lineYear = cal.get(Calendar.YEAR);

                if (lineYear == currentYear) {
                    linesThisYear.add(line);
                }
            } catch (ParseException e) {
                throw new RuntimeException(e);
            }
        }

        return linesThisYear;
    }



    // DEVELOPER NEED
    public String toString(Context context) {
        float[] ratios = CompareToWorldsDrinkers();

        String closestCountry = "";
        try {
            closestCountry = ClosestComparison(context);
        } catch (JSONException | IOException e) {
            e.printStackTrace();
            closestCountry = "N/A";
        }

        return String.format(Locale.FRANCE,
                "\n📊 Beer Stats Summary\n" +
                        "-----------------------------\n" +
                        "🍺 Total Beers: %d\n" +
                        "💶 Total Cost: %.2f€\n" +
                        "📦 Total Volume: %.2fL\n" +
                        "⭐ Average Satisfaction: %.2f/5.0\n" +

                        "\n📅 Daily Averages\n" +
                        "🍺 Beers/Day: %.2f\n" +
                        "💶 Cost/Day: %.2f€\n" +

                        "\n🏆 Favorites\n" +
                        "📍 Bar: %s\n" +
                        "🏷️ Brand: %s\n" +
                        "\uD83D\uDD54 Hour: %s\n" +

                        "\n📈 Streaks\n" +
                        "🔥 Longest Drinking Streak: %d day(s)\n" +
                        "❄️ Longest Non-Drinking Streak: %d day(s)\n" +

                        "\n💸 Cost Breakdown\n" +
                        "💶 Avg Cost per Beer: %.2f€\n" +
                        "🟢 Cheapest: %s\n" +
                        "🔴 Most Expensive: %s\n" +

                        "\n🧠 Health Metrics\n" +
                        "🔥 Estimated Calories: %.0f kcal\n" +
                        "🥴 Alcohol Units: %.2f\n" +

                        "\n🌍 Global Comparison (Your daily alcohol vs per capita average)\n" +
                        "🇷🇴 Romania: %.2fx\n" +
                        "🇬🇪 Georgia: %.2fx\n" +
                        "🇱🇻 Latvia: %.2fx\n" +
                        "🇫🇷 France: %.2fx\n" +
                        "🇮🇪 Ireland: %.2fx\n" +
                        "🇺🇸 USA: %.2fx\n" +
                        "🇧🇩 Bangladesh: %.2fx\n" +

                        "\n🔍 Closest Country Comparison\n" +
                        "🏅 Closest country based on your average alcohol units consumption: %s\n",
                GetTotalBeers(),
                GetTotalCost(),
                GetTotalVolume(),
                GetAverageSatisfaction(),
                GetAverageDrinksPerDay(),
                GetAverageCostPerDay(),
                GetFavoriteBar(),
                GetFavoriteBrand(),
                GetFavoriteHour(),
                GetLongestDrinkingStreak(),
                GetLongestNonDrinkingStreak(),
                GetAverageCost(),
                GetCheapestBeer(),
                GetMostExpensiveBeer(),
                GetCaloricIntakeFromBeer(),
                GetAlcoholUnitsConsumed(),
                ratios[0],
                ratios[1],
                ratios[2],
                ratios[3],
                ratios[4],
                ratios[5],
                ratios[6],
                closestCountry
        );
    }







}
