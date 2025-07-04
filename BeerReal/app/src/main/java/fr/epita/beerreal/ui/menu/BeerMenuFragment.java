package fr.epita.beerreal.ui.menu;

import android.annotation.SuppressLint;
import android.app.AlertDialog;
import android.app.Dialog;
import android.graphics.Color;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.widget.AppCompatRatingBar;
import androidx.fragment.app.DialogFragment;

import com.google.android.material.snackbar.Snackbar;

import java.io.File;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import fr.epita.beerreal.MainActivity;
import fr.epita.beerreal.ui.map.LocationStorage;
import fr.epita.beerreal.R;
import fr.epita.beerreal.csv.CsvHelper;
import fr.epita.beerreal.ui.stats.achievements.AchievementHandler;

public class BeerMenuFragment extends DialogFragment {

    private static String photo_path;
    private List<String> AlcodexBrands;

    public static BeerMenuFragment newInstance(String photoPath) {
        BeerMenuFragment fragment = new BeerMenuFragment();
        Bundle args = new Bundle();
        args.putString("photo_path", photoPath);

        photo_path = photoPath;

        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public Dialog onCreateDialog(Bundle savedInstanceState) {
        LayoutInflater inflater = getActivity().getLayoutInflater();
        View view = inflater.inflate(R.layout.fragment_menu, null);

        AlcodexBrands = MainActivity.alcodex.GetAllBrands();

        TextView customTitle = (TextView) inflater.inflate(R.layout.dialog_title, null);
        customTitle.setText(R.string.beer_information);
        customTitle.setTextColor(Color.WHITE);

        EditText titleInput = view.findViewById(R.id.title_input);
        titleInput.setTextColor(Color.WHITE);

        EditText brandInput = view.findViewById(R.id.brand_input);
        brandInput.setTextColor(Color.WHITE);

        EditText volumeInput = view.findViewById(R.id.volume_input);
        volumeInput.setTextColor(Color.WHITE);

        EditText priceInput = view.findViewById(R.id.price_input);
        priceInput.setTextColor(Color.WHITE);

        AppCompatRatingBar ratingInput = view.findViewById(R.id.rating_bar);

        EditText barInput = view.findViewById(R.id.bar_input);
        barInput.setTextColor(Color.WHITE);

        String post = Locale.getDefault().getLanguage().equals("fr") ?
                "Publier" :
                "Submit";

        String cancel = Locale.getDefault().getLanguage().equals("fr") ?
                "Annuler" :
                "Cancel";

        AlertDialog.Builder builder = new AlertDialog.Builder(getActivity());
        builder.setCustomTitle(customTitle)
                .setView(view)
                .setPositiveButton(post, (dialog, id) -> {
                    String title = titleInput.getText().toString().trim();
                    String brand = brandInput.getText().toString().trim();
                    String bar = barInput.getText().toString().trim();

                    if (title.isEmpty()) title = "Unknown Title";
                    if (brand.isEmpty()) brand = "Unknown Brand";
                    if (bar.isEmpty()) bar = "Unknown Bar";

                    // Safely parse volume and price, default to 0 if blank or invalid
                    float volume = safeParseFloat(volumeInput.getText().toString(), 0f);
                    float price = safeParseFloat(priceInput.getText().toString(), 0f);

                    if (title.contains(",") || brand.contains(",") || bar.contains(",")
                            || title.length() > 30 || brand.length() > 30 || bar.length() > 30) {

                        String text = Locale.getDefault().getLanguage().equals("fr") ?
                                "La longueur maximale est de 30 caractères et les virgules ne sont pas autorisées." :
                                "The maximum length is 30 characters and commas are not allowed";

                        Toast.makeText(requireContext(), text, Toast.LENGTH_LONG).show();

                        File imageFile = new File(photo_path);
                        if (imageFile.exists()) {
                            boolean deleted = imageFile.delete();
                            if (!deleted) {
                                System.out.println("Failed to delete image: " + photo_path);
                            }
                        }

                        dismiss();
                        return;
                    }

                    String finalTitle = title;
                    String finalBrand = brand;
                    String finalBar = bar;

                    LocationStorage.RecalculatePosition(requireContext(), (latitude, longitude) -> {

                        if (latitude == 0 && longitude == 0) {
                            String text = Locale.getDefault().getLanguage().equals("fr") ?
                                    "La localisation est désactivée. Activez la pour publier." :
                                    "Location is disabled. Please enable it to submit.";


                            Toast.makeText(requireContext(), text, Toast.LENGTH_LONG).show();

                            File imageFile = new File(photo_path);
                            if (imageFile.exists()) {
                                boolean deleted = imageFile.delete();
                                if (!deleted) {
                                    System.out.println("Failed to delete image: " + photo_path);
                                }
                            }

                            dismiss();
                            return;
                        }


                        CsvHelper.AddLineCsv(
                                photo_path,
                                finalTitle,
                                finalBrand,
                                volume,
                                price,
                                new double[] {latitude, longitude},
                                new Date(),
                                ratingInput.getRating(),
                                finalBar
                        );

                        Bundle result = new Bundle();

                        if (AlcodexBrands.contains(finalBrand) && !MainActivity.alcodex.LoadBeers().get(finalBrand).hasImage) {
                            result.putBoolean("show_alcodex", true);
                        } else {
                            result.putBoolean("show_alcodex", false);
                        }

                        AchievementHandler achievementHandler = new AchievementHandler(getContext());
                        boolean newAchievements = achievementHandler.CheckForNewAchievements(false);

                        if (newAchievements) {
                            result.putBoolean("show_achievements", true);
                        } else {
                            result.putBoolean("show_achievements", false);
                        }

                        getParentFragmentManager().setFragmentResult("refresh_feed", result);
                        getParentFragmentManager().setFragmentResult("show_achievements", result);
                        getParentFragmentManager().setFragmentResult("show_alcodex", result);

                        dismiss();
                    });
                })
                .setNegativeButton(cancel, (dialog, id) -> dismiss());


        AlertDialog dialog = builder.create();

        dialog.setOnShowListener(d -> {
            View buttonPanel = dialog.findViewById(getResources().getIdentifier("parentPanel", "id", "android"));
            if (buttonPanel != null) {
                buttonPanel.setBackgroundColor(Color.parseColor("#424242")); // Dark gray background
            }
        });

        return dialog;
    }

    private float safeParseFloat(String input, float fallback) {
        try {
            input = input.trim();
            if (input.isEmpty()) return fallback;
            return Float.parseFloat(input);
        } catch (NumberFormatException e) {
            return fallback;
        }
    }

    private void showCustomSnackbar(View anchorView) {
        Snackbar snackbar = Snackbar.make(anchorView, "", Snackbar.LENGTH_LONG);

        LayoutInflater inflater = LayoutInflater.from(requireContext());
        View customView = inflater.inflate(R.layout.notification, null);

        @SuppressLint("RestrictedApi") Snackbar.SnackbarLayout layout = (Snackbar.SnackbarLayout) snackbar.getView();
        layout.setBackgroundColor(Color.TRANSPARENT); // Hide default background
        layout.setPadding(0, 0, 0, 0); // Remove default padding
        layout.removeAllViews(); // Clear default content

        layout.addView(customView);

        snackbar.show();
    }


}
