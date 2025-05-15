package fr.epita.beerreal.csv;

import android.content.Context;
import android.widget.Toast;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Date;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import fr.epita.beerreal.MainActivity;

public class CsvHelper {


    // INITIALIZATION RELATED
    public static String InitialiseCSV(Context context)  {
        String dirName = "csv";

        File folder = new File(context.getExternalFilesDir(null), dirName);
        if (!folder.exists()) {
            boolean IsDirCreated = folder.mkdirs();
            if (!IsDirCreated)
                Toast.makeText(context, "Couldn't create the directory.", Toast.LENGTH_LONG).show();
        }

        File csvFile = new File(folder, "data.csv");

        try {
            if (!csvFile.exists()) {
                boolean isFileCreated = csvFile.createNewFile();
                if (isFileCreated) {
                    try (FileWriter writer = new FileWriter(csvFile)) {
                        writer.append("Photo_path,Title,Brand,Volume,Price,Latitude,Longitude,Date,Rating,Bar\n"); // CSV HEADER - to ignore
                        writer.flush();
                    }
                } else {
                    Toast.makeText(context, "Couldn't create the CSV file.", Toast.LENGTH_LONG).show();
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
            Toast.makeText(context, "Error creating CSV: " + e.getMessage(), Toast.LENGTH_LONG).show();
        }
        return context.getExternalFilesDir(null) + "/csv/data.csv";
    }

    public static void CreateImageDir(Context context) {
        String dirName = "pics";

        File folder = new File(context.getExternalFilesDir(null), dirName);
        if (!folder.exists()) {
            boolean IsDirCreated = folder.mkdirs();
            if (!IsDirCreated)
                Toast.makeText(context, "Couldn't create the directory.", Toast.LENGTH_LONG).show();
        }
    }







    // MANAGING NEW DATA RELATED
    public static void AddLineCsv(String path, String title, String brand, float volume, float price, double[] cords ,Date date, float rating, String bar) {
        String toAdd;
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd-HH:mm", Locale.FRANCE);
        toAdd = path + "," + title + "," + brand + "," + volume + "," + price + "," + cords[0] + "," + cords[1] + "," + dateFormat.format(date) + "," + rating + "," + bar + "\n";

        try (FileWriter writer = new FileWriter(MainActivity.CsvPath, true)) {
            writer.append(toAdd);
            writer.flush();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }











    // LOADING DATA RELATED
    public static List<String> LoadCsvAsStrings(Context context) {
        try {
            File file = new File(context.getExternalFilesDir(null), "csv/data.csv");
            FileInputStream fis = new FileInputStream(file);
            BufferedReader reader = new BufferedReader(new InputStreamReader(fis));

            List<String> lines = new ArrayList<>();
            String line;
            while ((line = reader.readLine()) != null) {
                lines.add(line);
            }

            reader.close();
            return lines;
        } catch (IOException e) {
            e.printStackTrace();
        }

        return null;
    }

    public static ArrayList<Line> GetLinesCsv(Context context) {
        List<String> lines = LoadCsvAsStrings(context);

        ArrayList<Line> res = new ArrayList<Line>();

        if (lines != null && lines.size() > 1) {
            for (int i = 1; i < lines.size(); i++) {
                String line = lines.get(i);
                String[] elements = line.split(",");

                res.add(new Line(
                        elements[0], // Picture path
                        elements[1], // Title
                        elements[2], // Brand
                        Float.parseFloat(elements[3]), // Volume
                        Float.parseFloat(elements[4]), // Price
                        Double.parseDouble(elements[5]), // Latitude
                        Double.parseDouble(elements[6]), // Longitude
                        elements[7], // Date (as String yyyy-mm-dd-HH:mm)
                        Float.parseFloat(elements[8]), // Rating
                        elements[9] // Bar
                ));
            }

            return res;
        } else {
            Toast.makeText(context, "You've never drank any beers! Get to it!", Toast.LENGTH_LONG).show();
        }

        return null;
    }










    // DEVELOPER NEEDS
    public static void ResetApp(Context context) {
        System.out.println("CSV + Pics deleted");

        File folderCsv = new File(context.getExternalFilesDir(null), "csv");
        File folderPics = new File(context.getExternalFilesDir(null), "pics");

        deleteFolderRecursively(folderCsv);
        deleteFolderRecursively(folderPics);
    }

    private static void deleteFolderRecursively(File folder) {
        if (folder != null && folder.exists()) {
            File[] files = folder.listFiles();
            if (files != null) {
                for (File file : files) {
                    if (file.isDirectory()) {
                        deleteFolderRecursively(file);
                    } else {
                        file.delete();
                    }
                }
            }
            folder.delete();
        }
    }


    public static void RemoveLine(Context context, String uniqueValue) {
        String filePath = InitialiseCSV(context);
        File csvFile = new File(filePath);
        File tempFile = new File(filePath + ".temp");

        try (BufferedReader reader = new BufferedReader(new FileReader(csvFile));
             BufferedWriter writer = new BufferedWriter(new FileWriter(tempFile))) {

            String line;
            while ((line = reader.readLine()) != null) {
                String[] fields = line.split(",");

                if (!fields[0].equals(uniqueValue)) {
                    writer.write(line);
                    writer.newLine();
                }
            }

            if (csvFile.delete()) {
                if (!tempFile.renameTo(csvFile)) {
                    System.out.println("Failed to rename the temp file to the original file name.");
                }
            } else {
                System.out.println("Failed to delete the original file.");
            }

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

