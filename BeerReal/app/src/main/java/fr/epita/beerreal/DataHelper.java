package fr.epita.beerreal;

import android.os.Build;

import androidx.annotation.RequiresApi;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

public class DataHelper {

    public static float Sum(List<Float> list) {
        if (list.isEmpty()) return 0;

        float sum = 0;
        for (int i = 0; i < list.size(); i++) {
            sum += list.get(i);
        }
        return sum;
    }

    public static int CountUniqueDays(List<String> dateTimeStrings) {
        Set<String> uniqueDays = new HashSet<>();
        for (int i = 0; i < dateTimeStrings.size(); i++) {
            String fullDate = dateTimeStrings.get(i);
            if (fullDate.length() >= 10) {
                uniqueDays.add(fullDate.substring(0, 10));
            }
        }
        return uniqueDays.size();
    }

    public static String GetFavorite(List<String> input) {
        if (input.isEmpty()) return "N/A";

        Map<String, Integer> counts = new HashMap<>();

        for (int i = 0; i < input.size(); i++) {
            String s = input.get(i).trim().toLowerCase();
            counts.put(s, counts.getOrDefault(s, 0) + 1);
        }

        List<String> favorites = new ArrayList<>();
        int maxCount = 0;

        for (Map.Entry<String, Integer> entry : counts.entrySet()) {
            int count = entry.getValue();

            if (count > maxCount) {
                favorites.clear();
                favorites.add(entry.getKey());
                maxCount = count;
            } else if (count == maxCount) {
                favorites.add(entry.getKey());
            }
        }

        if (favorites.size() == 1) {
            return favorites.get(0) + " (" + maxCount + ")";
        } else {
            return String.join(" / ", favorites) + " (" + maxCount + ")";
        }
    }

    public static float AverageConsumptionByDay(float liters) { // Converts litres of pure alcohol into alcohol volume per day
        return ((liters * 100) / 365);
    }

    public static int[] GetDrinkingStreak(List<String> dates) { // TODO
        if (dates == null || dates.isEmpty()) return new int[]{0, 0};

        List<String> uniqueDays = new ArrayList<>();
        for (String date : dates) {
            String day = date.split("-")[0] + "-" + date.split("-")[1] + "-" + date.split("-")[2];
            if (!uniqueDays.contains(day)) {
                uniqueDays.add(day);
            }
        }

        if (uniqueDays.isEmpty()) return new int[]{0, 0};

        uniqueDays.sort((d1, d2) -> {
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd", Locale.FRANCE);
            try {
                Date date1 = dateFormat.parse(d1);
                Date date2 = dateFormat.parse(d2);
                return date1.compareTo(date2);
            } catch (ParseException e) {
                throw new RuntimeException(e);
            }
        });

        int longestDrinkingStreak = 1;
        int currentDrinkingStreak = 1;
        int longestNonDrinkingStreak = 0;
        int currentNonDrinkingStreak = 0;

        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd", Locale.FRANCE);
        try {
            Date prevDate = dateFormat.parse(uniqueDays.get(0));
            for (int i = 1; i < uniqueDays.size(); i++) {
                Date currentDate = dateFormat.parse(uniqueDays.get(i));

                Calendar prevCal = Calendar.getInstance();
                prevCal.setTime(prevDate);
                Calendar currentCal = Calendar.getInstance();
                currentCal.setTime(currentDate);

                long diff = currentCal.getTimeInMillis() - prevCal.getTimeInMillis();
                int daysDiff = (int) (diff / (24 * 60 * 60 * 1000));

                if (daysDiff == 1) {
                    currentDrinkingStreak++;
                    if (currentDrinkingStreak > longestDrinkingStreak) {
                        longestDrinkingStreak = currentDrinkingStreak;
                    }
                    currentNonDrinkingStreak = 0;
                } else {
                    currentNonDrinkingStreak += daysDiff - 1;
                    if (currentNonDrinkingStreak > longestNonDrinkingStreak) {
                        longestNonDrinkingStreak = currentNonDrinkingStreak;
                    }
                    currentDrinkingStreak = 1;
                }
                prevDate = currentDate;
            }
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }

        return new int[]{longestDrinkingStreak, longestNonDrinkingStreak};
    }
}
