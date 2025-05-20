package fr.epita.beerreal.data;

import static fr.epita.beerreal.csv.CsvHelper.GetLinesCsv;

import android.content.Context;
import android.os.Build;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import fr.epita.beerreal.csv.Line;

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


    public static String GetMost(List<String> input) {
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

    public static int FindLongestStreakLength(List<String> dateTimeStrings) {
        DateTimeFormatter formatter = null;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd-HH:mm");

            Set<LocalDate> dateSet = new HashSet<>();

            for (String dateTimeStr : dateTimeStrings) {
                LocalDateTime dateTime = LocalDateTime.parse(dateTimeStr, formatter);
                dateSet.add(dateTime.toLocalDate());
            }

            int bestLength = 0;

            for (LocalDate date : dateSet) {
                if (!dateSet.contains(date.minusDays(1))) {
                    LocalDate current = date;
                    int length = 1;

                    while (dateSet.contains(current.plusDays(1))) {
                        current = current.plusDays(1);
                        length++;
                    }

                    if (length > bestLength) {
                        bestLength = length;
                    }
                }
            }

            return bestLength;
        }
        return 0;
    }


    public static int FindLongestMissingStreak(List<String> dateTimeStrings) {
        DateTimeFormatter formatter = null;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd-HH:mm");

            Set<LocalDate> presentDates = new HashSet<>();

            for (String dateTimeStr : dateTimeStrings) {
                LocalDateTime dateTime = LocalDateTime.parse(dateTimeStr, formatter);
                presentDates.add(dateTime.toLocalDate());
            }

            if (presentDates.isEmpty()) return 0;

            // Determine the range to scan
            LocalDate minDate = Collections.min(presentDates);
            LocalDate maxDate = Collections.max(presentDates);

            int longestGap = 0;
            int currentGap = 0;

            LocalDate cursor = minDate;
            while (!cursor.isAfter(maxDate)) {
                if (!presentDates.contains(cursor)) {
                    currentGap++;
                    longestGap = Math.max(longestGap, currentGap);
                } else {
                    currentGap = 0;
                }
                cursor = cursor.plusDays(1);
            }

            return longestGap;
        }
        return 0;
    }


}