package fr.epita.beerreal;

import android.content.Context;

import androidx.annotation.NonNull;

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

    public Data(Context context, Times time) {
        Lines = CsvHelper.GetLinesCsv(context);
        _time = time;

        Brands = new ArrayList<>();
        Volumes = new ArrayList<>();
        Prices = new ArrayList<>();
        Dates = new ArrayList<>();
        Bars = new ArrayList<>();
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
            Brands.add(l.Brand);
            Volumes.add(l.Volume);
            Prices.add(l.Price);
            Dates.add(l.Date);
            Bars.add(l.Bar);
        }
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
    @Override
    public String toString() {
        return "Data Summary:\n" +
                "- Brands: " + (Brands != null ? Brands.size() : 0) + "\n" +
                "- Volumes: " + (Volumes != null ? Volumes.size() : 0) + "\n" +
                "- Prices: " + (Prices != null ? Prices.size() : 0) + "\n" +
                "- Dates: " + (Dates != null ? Dates.size() : 0) + "\n" +
                "- Bars: " + (Bars != null ? Bars.size() : 0);
    }

}
