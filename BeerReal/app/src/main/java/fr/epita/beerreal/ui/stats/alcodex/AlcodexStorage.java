package fr.epita.beerreal.ui.stats.alcodex;

import android.content.Context;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.io.*;
import java.lang.reflect.Type;
import java.util.ArrayList;
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
        CopyFileFromAssetsIfNeeded();
        UpdateBeers();
    }

    private void CopyFileFromAssetsIfNeeded() {
        if (!file.exists()) {
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
       }
    }

    public Map<String, BeerInfo> LoadBeers() {
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

    public void SaveBeers(Map<String, BeerInfo> beers) {
        try (Writer writer = new FileWriter(file)) {
            gson.toJson(beers, writer);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void UpdateBeers() {
        Map<String, BeerInfo> beers = LoadBeers();
        List<String> uniqueBrands = CsvHelper.GetUniqueBrands(context);

        Map<String, String> normalizedJsonBrandToOriginal = new HashMap<>();
        for (String existingBrand : beers.keySet()) {
            String normalized = CsvHelper.NormalizeBrand(existingBrand);
            normalizedJsonBrandToOriginal.put(normalized, existingBrand);
        }

        for (String brand : uniqueBrands) {
            String normalized = CsvHelper.NormalizeBrand(brand);

            if (normalizedJsonBrandToOriginal.containsKey(normalized)) {
                String originalKey = normalizedJsonBrandToOriginal.get(normalized);

                String photoPath = CsvHelper.FindFirstPhotoPathForBrand(context, brand);
                boolean hasImage = photoPath != null && !photoPath.isEmpty();

                BeerInfo beerInfo = beers.get(originalKey);
                if (beerInfo != null) {
                    beerInfo.hasImage = hasImage;
                    beerInfo.photoPath = photoPath;
                }
            }
        }

        SaveBeers(beers);
    }




    public List<String> GetAllBrands() {
        Map<String, BeerInfo> beers = LoadBeers();
        return new ArrayList<>(beers.keySet());
    }

    public void ClearPhotoForBrand(String brand) {
        Map<String, BeerInfo> beers = LoadBeers();

        BeerInfo beer = beers.get(brand);
        if (beer != null) {
            beer.photoPath = null;
            beer.hasImage = false;
            SaveBeers(beers);
        }
    }

}
