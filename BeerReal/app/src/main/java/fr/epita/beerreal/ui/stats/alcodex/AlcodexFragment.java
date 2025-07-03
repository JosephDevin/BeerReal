package fr.epita.beerreal.ui.stats.alcodex;

import android.app.AlertDialog;
import android.app.Dialog;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.graphics.Matrix;
import android.os.Bundle;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.GridLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.exifinterface.media.ExifInterface;
import androidx.fragment.app.DialogFragment;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.List;
import java.util.Map;

import fr.epita.beerreal.MainActivity;
import fr.epita.beerreal.R;
import fr.epita.beerreal.csv.CsvHelper;

public class AlcodexFragment extends DialogFragment {

    private static Context context;

    public static AlcodexFragment newInstance(Context cxt) {
        context = cxt;
        UpdateBeersWithCsvImages();
        return new AlcodexFragment();
    }

    private static void UpdateBeersWithCsvImages() {
        Map<String, BeerInfo> beers = MainActivity.alcodex.LoadBeers();
        List<String> uniqueBrands = CsvHelper.GetUniqueBrands(context);

        for (String brand : uniqueBrands) {
            String photoPath = FindFirstPhotoPathForBrand(context, brand);
            boolean hasImage = photoPath != null && !photoPath.isEmpty();

            BeerInfo existing = beers.get(brand);
            if (existing != null) {
                existing.hasImage = hasImage;
                existing.photoPath = photoPath;
            }
            beers.put(brand, existing);
        }

        MainActivity.alcodex.SaveBeers(beers);
    }

    private static String FindFirstPhotoPathForBrand(Context context, String brand) {
        File file = new File(context.getExternalFilesDir(null), "csv/data.csv");

        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
            String line;
            boolean isFirstLine = true;
            String normalizedTarget = NormalizeBrand(brand);

            while ((line = reader.readLine()) != null) {
                if (isFirstLine) {
                    isFirstLine = false;
                    continue;
                }

                String[] parts = line.split(",");
                if (parts.length < 3) continue;

                String csvBrand = parts[2].trim();
                String normalizedCsvBrand = NormalizeBrand(csvBrand);

                if (normalizedCsvBrand.equals(normalizedTarget)) {
                    return parts[0].trim();
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    private static String NormalizeBrand(String brand) {
        return brand.toLowerCase().replaceAll("[^a-z]", "");
    }


    @Override
    public Dialog onCreateDialog(Bundle saved) {
        LayoutInflater inflater = requireActivity().getLayoutInflater();
        View view = inflater.inflate(R.layout.fragment_alcodex, null);

        TextView customTitle = (TextView) inflater.inflate(R.layout.dialog_title, null);
        customTitle.setText("Alcodex");

        Map<String, BeerInfo> map = MainActivity.alcodex.LoadBeers();
        GridLayout grid = view.findViewById(R.id.grid_beer_list);

        for (Map.Entry<String, BeerInfo> entry : map.entrySet()) {
            LinearLayout itemLayout = new LinearLayout(context);
            itemLayout.setOrientation(LinearLayout.VERTICAL);
            itemLayout.setLayoutParams(new ViewGroup.LayoutParams(
                    ViewGroup.LayoutParams.WRAP_CONTENT,
                    ViewGroup.LayoutParams.WRAP_CONTENT
            ));
            itemLayout.setGravity(Gravity.CENTER);

            ImageView imageView = new ImageView(context);

            if (!entry.getValue().hasImage || entry.getValue().photoPath == null || entry.getValue().photoPath.isEmpty()) {
                imageView.setImageResource(R.drawable.beer_unknown);
            } else {
                File imgFile = new File(context.getExternalFilesDir("pics"), entry.getValue().photoPath);
                if (imgFile.exists()) {
                    imageView.setImageBitmap(loadThumbnailRotated90(imgFile, 300));
                }
            }

            imageView.setLayoutParams(new ViewGroup.LayoutParams(300, 500));

            TextView textView = new TextView(context);
            textView.setText(entry.getKey());
            textView.setTextColor(Color.rgb(184,184,184));
            textView.setGravity(Gravity.CENTER_HORIZONTAL | Gravity.TOP);
            textView.setHeight(175);

            itemLayout.addView(imageView);
            itemLayout.addView(textView);

            grid.addView(itemLayout);
        }

        AlertDialog.Builder builder = new AlertDialog.Builder(requireActivity());
        builder.setCustomTitle(customTitle)
                .setView(view);

        return builder.create();
    }

    public Bitmap loadThumbnailRotated90(File file, int maxDim) {
        BitmapFactory.Options options = new BitmapFactory.Options();
        options.inJustDecodeBounds = true;
        BitmapFactory.decodeFile(file.getAbsolutePath(), options);

        int scale = 1;
        while (options.outWidth / scale > maxDim || options.outHeight / scale > maxDim) {
            scale *= 2;
        }

        options.inJustDecodeBounds = false;
        options.inSampleSize = scale;
        Bitmap bitmap = BitmapFactory.decodeFile(file.getAbsolutePath(), options);

        Matrix matrix = new Matrix();
        matrix.postRotate(90);

        return Bitmap.createBitmap(
                bitmap,
                0, 0,
                bitmap.getWidth(),
                bitmap.getHeight(),
                matrix,
                true
        );
    }

    private Bitmap LoadPictureCorrectly(File imgFile) {
        if (imgFile.exists()) {
            Bitmap bitmap = BitmapFactory.decodeFile(imgFile.getAbsolutePath());



            return bitmap;
        }
        return null;
    }

}
