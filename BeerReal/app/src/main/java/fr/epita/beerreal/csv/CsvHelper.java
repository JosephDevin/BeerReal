package fr.epita.beerreal.csv;

import android.content.Context;
import android.os.Build;
import android.widget.Toast;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Date;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import fr.epita.beerreal.Line;
import fr.epita.beerreal.MainActivity;

public class CsvHelper {

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
                        writer.append("Photo_path,Title,Brand,Volume,Price,Latitude,Longitude,Date\n"); // CSV HEADER - to ignore
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

    public static void AddLineCsv(String path, String title, String brand, float volume, float price, double[] coords ,Date date, String bar) {
        String toAdd;
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        toAdd = path + "," + title + "," + brand + "," + volume + "," + price + "," + coords[0] + "," + coords[1] + "," + dateFormat.format(date) + "\n";

        try (FileWriter writer = new FileWriter(MainActivity.CsvPath, true)) {
            writer.append(toAdd);
            writer.flush();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static List<String> LoadCsvAsStrings(Context context) {
        try {
            File file = new File(context.getExternalFilesDir(null), "csv/data.csv");
            FileInputStream fis = new FileInputStream(file);
            BufferedReader reader = new BufferedReader(new InputStreamReader(fis));

            System.out.println(context.getExternalFilesDir(null) + "/csv/data.csv");

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
                        elements[1], // Name
                        elements[2], // Title
                        Float.parseFloat(elements[3]), // Volume
                        Float.parseFloat(elements[4]), // Price
                        Double.parseDouble(elements[5]), // Latitude
                        Double.parseDouble(elements[6]), // Longitude
                        elements[7] // Date (as String yyyy-mm-dd)
                ));
            }

            return res;
        } else {
            Toast.makeText(context, "You've never drank any beers! Get to it!", Toast.LENGTH_LONG).show();
        }

        return null;
    }

}
