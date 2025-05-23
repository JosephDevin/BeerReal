package fr.epita.beerreal.ui.menu;

import android.annotation.SuppressLint;
import android.app.AlertDialog;
import android.app.Dialog;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.graphics.Matrix;
import android.graphics.Typeface;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RatingBar;
import android.widget.TextView;

import androidx.exifinterface.media.ExifInterface;
import androidx.fragment.app.DialogFragment;
import androidx.fragment.app.Fragment;

import java.io.File;
import java.io.IOException;
import java.util.Objects;

import fr.epita.beerreal.MainActivity;
import fr.epita.beerreal.csv.Line;
import fr.epita.beerreal.R;
import fr.epita.beerreal.csv.CsvHelper;
import fr.epita.beerreal.ui.map.MapFragment;

public class ViewPhotoFragment extends DialogFragment {

    private static Line line;
    private static Fragment map;

    public static ViewPhotoFragment newInstance(Line l, Fragment m) {
        ViewPhotoFragment fragment = new ViewPhotoFragment();
        line = l;
        map = m;
        return fragment;
    }

    @SuppressLint("SetTextI18n")
    @Override
    public Dialog onCreateDialog(Bundle savedInstanceState) {
        LayoutInflater inflater = requireActivity().getLayoutInflater();
        View view = inflater.inflate(R.layout.fragment_view_photo, null);

        ImageView image = view.findViewById(R.id.photoImageView);
        File imgFile = new File(requireContext().getExternalFilesDir("pics"), line.Picture);
        image.setImageBitmap(LoadPictureCorrectly(imgFile));

        String dateValue = line.Date.substring(0, 10).replace('-', ' ');
        String hourValue = line.Date.substring(11, 16);

        // Load text views
        TextView brand = view.findViewById(R.id.brandText);
        TextView volume = view.findViewById(R.id.volumeText);
        TextView price = view.findViewById(R.id.priceText);
        TextView hour = view.findViewById(R.id.hourText);
        TextView bar = view.findViewById(R.id.barText);
        RatingBar rating = view.findViewById(R.id.ratingBar);

        brand.setTextColor(Color.WHITE);
        volume.setTextColor(Color.WHITE);
        price.setTextColor(Color.WHITE);
        hour.setTextColor(Color.WHITE);
        bar.setTextColor(Color.WHITE);

        // Build the custom title
        LinearLayout layout = CreateText(line.Title, dateValue);

        AlertDialog.Builder builder = new AlertDialog.Builder(requireActivity());
        builder.setCustomTitle(layout)
                .setView(view)
                .setPositiveButton("Delete", null);

        AlertDialog dialog = builder.create();

        dialog.setOnShowListener(d -> {
            Button deleteButton = dialog.getButton(AlertDialog.BUTTON_POSITIVE);
            if (deleteButton != null) {
                deleteButton.setTextColor(Color.rgb(251, 177, 34));  // existing color

                View buttonPanel = (View) deleteButton.getParent();
                if (buttonPanel != null) {
                    buttonPanel.setBackgroundColor(Color.rgb(66, 66, 66));
                }

                deleteButton.setOnClickListener(v -> {
                    AlertDialog confirmDialog = new AlertDialog.Builder(getActivity())
                            .setTitle("Delete this beer ?")
                            .setMessage("Are you sure you want to delete this beer?")
                            .setPositiveButton("Delete", (confirm, which) -> {
                                CsvHelper.RemoveLine(requireContext(), line.Picture);

                                File imgToDelete = new File(requireContext().getExternalFilesDir("pics"), line.Picture);
                                if (imgToDelete.exists()) {
                                    boolean deleted = imgToDelete.delete();
                                    if (!deleted) {
                                        System.out.println("Failed to delete image: " + imgToDelete.getAbsolutePath());
                                    }
                                }

                                if (map instanceof MapFragment) {
                                    ((MapFragment) map).ClearAllMarkers();
                                    ((MapFragment) map).LoadBeers();
                                }

                                if (MainActivity.alcodex.GetAllBrands().contains(line.Brand)) {
                                    if (!CsvHelper.IsBrandDuplicated(line.Brand, requireContext())
                                            && !Objects.equals(requireContext().getExternalFilesDir("pics") + line.Picture,
                                            MainActivity.alcodex.LoadBeers().get(line.Brand).photoPath)) {
                                        MainActivity.alcodex.ClearPhotoForBrand(line.Brand);
                                    }
                                }

                                Bundle result = new Bundle();
                                getParentFragmentManager().setFragmentResult("refresh_feed", result);
                                dismiss();
                            })

                            .setNegativeButton("Cancel", (confirm, which) -> confirm.dismiss())
                            .create();

                    confirmDialog.getWindow().setBackgroundDrawable(new ColorDrawable(Color.rgb(66, 66, 66)));

                    confirmDialog.setOnShowListener(c -> {
                        Button pos = confirmDialog.getButton(AlertDialog.BUTTON_POSITIVE);
                        Button neg = confirmDialog.getButton(AlertDialog.BUTTON_NEGATIVE);

                        if (pos != null) {
                            pos.setTextColor(Color.rgb(251, 177, 34));  // existing color
                        }
                        if (neg != null) {
                            neg.setTextColor(Color.rgb(251, 177, 34));  // existing color
                        }

                        // Change confirm dialog footer background
                        if (pos != null) {
                            View footer = (View) pos.getParent();
                            if (footer != null) {
                                footer.setBackgroundColor(Color.rgb(66, 66, 66));
                            }
                        }

                        // ✳️ Set message text color to white
                        TextView message = confirmDialog.findViewById(android.R.id.message);
                        if (message != null) {
                            message.setTextColor(Color.WHITE);
                        }

                        // ✳️ Set title text color to white
                        TextView title = confirmDialog.findViewById(android.R.id.title);
                        if (title != null) {
                            title.setTextColor(Color.WHITE);
                        }
                    });

                    confirmDialog.show();
                });
            }
        });

        // Set field values
        brand.setText(getString(R.string.brand_view) + "       " + line.Brand);
        volume.setText(getString(R.string.volume) + "    " + line.Volume + " L");
        price.setText(getString(R.string.price) + "         " + line.Price + " €");
        bar.setText(getString(R.string.bar_location_view) + "            " + line.Bar);
        hour.setText(getString(R.string.hour) + "         " + hourValue);
        rating.setRating(line.Rating);

        return dialog;
    }

    // Load and rotate image if needed
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

                return Bitmap.createBitmap(bitmap, 0, 0, bitmap.getWidth(), bitmap.getHeight(), matrix, true);

            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return null;
    }

    // Create a custom title bar
    private LinearLayout CreateText(String title, String date) {
        LinearLayout layout = new LinearLayout(requireContext());
        layout.setOrientation(LinearLayout.HORIZONTAL);
        layout.setPadding(32, 32, 32, 16);
        layout.setBackgroundColor(Color.rgb(66, 66, 66));
        layout.setLayoutParams(new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT));

        TextView titleText = new TextView(requireContext());
        titleText.setText(title);
        titleText.setTextSize(20);
        titleText.setTypeface(null, Typeface.BOLD);
        titleText.setTextColor(Color.rgb(200, 200, 200)); // already colored — keep as-is
        titleText.setLayoutParams(new LinearLayout.LayoutParams(
                0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f));

        TextView dateText = new TextView(requireContext());
        dateText.setText(date);
        dateText.setTextSize(20);
        dateText.setTextColor(Color.rgb(136, 136, 136)); // already colored — keep as-is
        dateText.setTypeface(null, Typeface.NORMAL);
        dateText.setGravity(Gravity.END);

        layout.addView(titleText);
        layout.addView(dateText);

        return layout;
    }
}
