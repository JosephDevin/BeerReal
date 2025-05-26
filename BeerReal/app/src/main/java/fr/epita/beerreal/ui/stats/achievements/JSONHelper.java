package fr.epita.beerreal.ui.stats.achievements;

import android.content.Context;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.*;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class JSONHelper {
    private final Context context;
    private final String filename;
    private List<Achievement> achievementsList;

    public JSONHelper(Context context, String filename) {
        this.context = context;
        this.filename = filename;

        InitializeAchievementsFileIfMissing();

        String json = ReadJsonFromFile();
        if (json.trim().isEmpty()) {
            throw new RuntimeException("JSON file is empty or not correctly copied.");
        }

        achievementsList = new ArrayList<>();
        try {
            JSONObject achievementsJson = new JSONObject(json);
            Iterator<String> keys = achievementsJson.keys();
            while (keys.hasNext()) {
                String key = keys.next();
                JSONObject obj = achievementsJson.getJSONObject(key);

                String description = obj.optString("description", "");
                boolean unlocked = obj.optBoolean("unlocked", false);

                achievementsList.add(new Achievement(key, description, unlocked));
            }
        } catch (JSONException e) {
            throw new RuntimeException("Failed to parse achievements JSON.", e);
        }
    }

    public String SetUnlocked(String name, boolean value) {
        for (Achievement a : achievementsList) {
            if (a.Name.equals(name)) {
                a.Unlocked = value;
                SaveAchievementsToFile();
                return a.Name;
            }
        }
        throw new IllegalArgumentException(name + " couldn't be found");
    }


    public List<Achievement> GetAllAchievements() {
        return achievementsList;
    }

    public List<Achievement> GetAllUnlocked() {
        List<Achievement> unlocked = new ArrayList<>();
        for (Achievement a : achievementsList) {
            if (a.Unlocked) {
                unlocked.add(a);
            }
        }
        return unlocked;
    }

    public List<Achievement> GetAllLocked() {
        List<Achievement> locked = new ArrayList<>();
        for (Achievement a : achievementsList) {
            if (!a.Unlocked) {
                locked.add(a);
            }
        }
        return locked;
    }

    private File getAchievementsFile() {
        return new File(context.getExternalFilesDir("csv"), filename);
    }

    private void InitializeAchievementsFileIfMissing() {
        File file = getAchievementsFile();
        if (!file.exists() || file.length() == 0) {
            try (InputStream is = context.getAssets().open(filename);
                 FileOutputStream fos = new FileOutputStream(file)) {

                byte[] buffer = new byte[1024];
                int length;
                while ((length = is.read(buffer)) > 0) {
                    fos.write(buffer, 0, length);
                }
                fos.flush();

            } catch (IOException e) {
                throw new RuntimeException("Failed to copy achievements.json from assets.", e);
            }
        }
    }

    private String ReadJsonFromFile() {
        File file = getAchievementsFile();
        StringBuilder json = new StringBuilder();

        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
            String line;
            while ((line = reader.readLine()) != null) {
                json.append(line);
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to read achievements.json from file.", e);
        }

        return json.toString();
    }

    private void SaveAchievementsToFile() {
        JSONObject achievementsJson = new JSONObject();
        try {
            for (Achievement a : achievementsList) {
                JSONObject obj = new JSONObject();
                obj.put("description", a.Description);
                obj.put("unlocked", a.Unlocked);
                achievementsJson.put(a.Name, obj);
            }

            File file = getAchievementsFile();
            try (FileWriter writer = new FileWriter(file, false)) {
                writer.write(achievementsJson.toString(4));  // pretty print with indent 4
            } catch (IOException e) {
                throw new RuntimeException("Failed to write achievements JSON to file.", e);
            }
        } catch (JSONException e) {
            throw new RuntimeException("Failed to serialize achievements to JSON.", e);
        }
    }

}
