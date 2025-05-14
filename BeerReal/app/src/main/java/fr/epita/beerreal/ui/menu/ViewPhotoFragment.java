package fr.epita.beerreal.ui.menu;

import android.annotation.SuppressLint;
import android.app.AlertDialog;
import android.app.Dialog;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.graphics.Matrix;
import android.graphics.Typeface;
import android.os.Bundle;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RatingBar;
import android.widget.TextView;

import androidx.exifinterface.media.ExifInterface;
import androidx.fragment.app.DialogFragment;

import java.io.File;
import java.io.IOException;

import fr.epita.beerreal.Line;
import fr.epita.beerreal.R;
import fr.epita.beerreal.csv.CsvHelper;
import fr.epita.beerreal.ui.map.MapFragment;

public class ViewPhotoFragment extends DialogFragment {

    private static Line line;
    private static MapFragment map;

    public static ViewPhotoFragment newInstance(Line l, MapFragment m) {
        ViewPhotoFragment fragment = new ViewPhotoFragment();

        line = l;
        map = m;

        return fragment;
    }

    @SuppressLint("SetTextI18n")
    @Override
    public Dialog onCreateDialog(Bundle savedInstanceState) {
        LayoutInflater inflater = getActivity().getLayoutInflater();
        View view = inflater.inflate(R.layout.fragment_view_photo, null);

        ImageView image = view.findViewById(R.id.photoImageView);
        File imgFile = new File(requireContext().getExternalFilesDir("pics"), line.Picture);

        String dateValue = line.Date.substring(0,10).replace('-',' ');
        String hourValue = line.Date.substring(11, 16);

        image.setImageBitmap(LoadPictureCorrectly(imgFile));

        // LOAD ALL DATA
        TextView brand = view.findViewById(R.id.brandText);
        TextView volume = view.findViewById(R.id.volumeText);
        TextView price = view.findViewById(R.id.priceText);
        TextView hour = view.findViewById(R.id.hourText);
        TextView bar = view.findViewById(R.id.barText);
        RatingBar rating = view.findViewById(R.id.ratingBar);

        LinearLayout layout = CreateText(line.Title, dateValue);

        AlertDialog.Builder builder = new AlertDialog.Builder(getActivity());
        builder.setCustomTitle(layout)
                .setView(view)
                .setPositiveButton("Delete", (dialog, id) -> {
                    CsvHelper.RemoveLine(requireContext(), line.Picture);
                    map.ClearAllMarkers();
                    map.LoadBeers();
                });


        brand.setText(String.format("%s       %s", getString(R.string.brand_view), line.Brand));
        volume.setText(String.format("%s    %s L", getString(R.string.volume), line.Volume));
        price.setText(String.format("%s         %s €", getString(R.string.price), line.Price));
        bar.setText(String.format("%s            %s", getString(R.string.bar_location_view), line.Bar));
        hour.setText(String.format("%s         %s", getString(R.string.hour), hourValue));
        rating.setRating(line.Rating);


        return builder.create();
    }








    // UTILITIES

    private Bitmap LoadPictureCorrectly(File imgFile) {
        if (imgFile.exists()) {
            try {
                Bitmap bitmap = BitmapFactory.decodeFile(imgFile.getAbsolutePath());

                ExifInterface exif = new ExifInterface(imgFile.getAbsolutePath());
                int orientation = exif.getAttributeInt(
                        ExifInterface.TAG_ORIENTATION,
                        ExifInterface.ORIENTATION_NORMAL
                );

                Matrix matrix = new Matrix();
                switch (orientation) {
                    case ExifInterface.ORIENTATION_ROTATE_90:
                        matrix.postRotate(90);
                        break;
                    case ExifInterface.ORIENTATION_ROTATE_180:
                        matrix.postRotate(180);
                        break;
                    case ExifInterface.ORIENTATION_ROTATE_270:
                        matrix.postRotate(270);
                        break;
                }

                Bitmap rotatedBitmap = Bitmap.createBitmap(
                        bitmap,
                        0, 0,
                        bitmap.getWidth(), bitmap.getHeight(),
                        matrix,
                        true
                );

                return rotatedBitmap;

            } catch (IOException e) {
                e.printStackTrace(); // or handle properly
            }
        }
        return null;
    }

    private LinearLayout CreateText(String title, String date) {
        LinearLayout layout = new LinearLayout(requireContext());
        layout.setOrientation(LinearLayout.HORIZONTAL);
        layout.setPadding(32, 32, 32, 16);
        layout.setLayoutParams(new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT));

        TextView titleText = new TextView(requireContext());
        titleText.setText(title);
        titleText.setTextSize(20);
        titleText.setTypeface(null, Typeface.BOLD);
        titleText.setLayoutParams(new LinearLayout.LayoutParams(
                0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f));

        TextView dateText = new TextView(requireContext());
        dateText.setText(date);
        dateText.setTextSize(20);
        dateText.setTextColor(Color.GRAY);
        dateText.setTypeface(null, Typeface.NORMAL);
        dateText.setGravity(Gravity.END);

        layout.addView(titleText);
        layout.addView(dateText);

        return layout;
    }
}

