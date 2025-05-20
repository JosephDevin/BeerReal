package fr.epita.beerreal;

import android.content.Context;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.io.*;
import java.lang.reflect.Type;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import fr.epita.beerreal.csv.CsvHelper;

public class AlcodexStorage {

    private final File file;
    private final Gson gson = new Gson();
    private final Context context;

    public AlcodexStorage(Context context) {
        this.context = context;
        file = new File(context.getExternalFilesDir("csv"), "alcodex.json");
        copyFileFromAssetsIfNeeded();
        updateBeers();
    }

    private void copyFileFromAssetsIfNeeded() {
        //if (!file.exists()) {
            try (InputStream is = context.getAssets().open("alcodex.json");
                 OutputStream os = new FileOutputStream(file)) {

                byte[] buffer = new byte[1024];
                int length;
                while ((length = is.read(buffer)) > 0) {
                    os.write(buffer, 0, length);
                }

            } catch (IOException e) {
                e.printStackTrace();
            }
        //}
    }

    public Map<String, BeerInfo> loadBeers() {
        if (!file.exists()) {
            return new HashMap<>();
        }

        try (Reader reader = new FileReader(file)) {
            Type type = new TypeToken<Map<String, BeerInfo>>() {}.getType();
            Map<String, BeerInfo> beers = gson.fromJson(reader, type);
            if (beers == null) {
                beers = new HashMap<>();
            }
            return beers;
        } catch (IOException e) {
            e.printStackTrace();
            return new HashMap<>();
        }
    }

    public void saveBeers(Map<String, BeerInfo> beers) {
        try (Writer writer = new FileWriter(file)) {
            gson.toJson(beers, writer);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void updateBeer(String brand, boolean hasImage, String photoPath) {
        Map<String, BeerInfo> beers = loadBeers();
        BeerInfo existing = beers.get(brand);

        if (existing == null) {
            existing = new BeerInfo(brand, hasImage, photoPath);
        } else {
            existing.hasImage = hasImage;
            existing.photoPath = photoPath;
        }

        beers.put(brand, existing);
        saveBeers(beers);
    }

    public void updateBeers() {
        Map<String, BeerInfo> beers = loadBeers();
        List<String> uniqueBrands = CsvHelper.getUniqueBrands(context);

        for (String brand : uniqueBrands) {
            String photoPath = CsvHelper.findFirstPhotoPathForBrand(context, brand);
            boolean hasImage = photoPath != null && !photoPath.isEmpty();

            // Update or create new BeerInfo
            BeerInfo existing = beers.get(brand);
            if (existing == null) {
                existing = new BeerInfo(brand, hasImage, photoPath);
            } else {
                existing.hasImage = hasImage;
                existing.photoPath = photoPath;
            }

            beers.put(brand, existing);
        }

        saveBeers(beers);
    }


}
