package fr.epita.beerreal.ui.menu;

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

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import fr.epita.beerreal.MainActivity;
import fr.epita.beerreal.csv.Line;
import fr.epita.beerreal.ui.map.LocationStorage;
import fr.epita.beerreal.R;
import fr.epita.beerreal.csv.CsvHelper;
import fr.epita.beerreal.ui.stats.achievements.Achievement;
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
        customTitle.setText("Beer Information");
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

        AlertDialog.Builder builder = new AlertDialog.Builder(getActivity());
        builder.setCustomTitle(customTitle)
                .setView(view)
                .setPositiveButton("Submit", (dialog, id) -> {
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
                        Toast.makeText(requireContext(), "The maximum length is 30 characters and commas are not allowed", Toast.LENGTH_LONG).show();

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
                        getParentFragmentManager().setFragmentResult("refresh_feed", result);
                        dismiss();

                        if (AlcodexBrands.contains(finalBrand) && !MainActivity.alcodex.LoadBeers().get(finalBrand).hasImage) {
                            Toast.makeText(requireContext(), "You've just unlocked a beer in the alcodex!", Toast.LENGTH_LONG).show();
                        }

                        AchievementHandler achievementHandler = new AchievementHandler(getContext());
                        achievementHandler.CheckForNewAchievements(MainActivity.achievements.GetAllLocked(),
                                new Line(photo_path,
                                        finalTitle,
                                        finalBrand,
                                        volume,
                                        price,
                                        latitude,
                                        longitude,
                                        new SimpleDateFormat("yyyy-MM-dd-HH:mm").format(new Date()),
                                        ratingInput.getRating(),
                                        finalBar
                                )
                        );
                        System.out.println("UNLOCKED");
                        for (Achievement a : MainActivity.achievements.GetAllUnlocked()) {
                            System.out.println(a.Name + ": " + a.Unlocked);
                        }
                        System.out.println("LOCKED");
                        for (Achievement a : MainActivity.achievements.GetAllLocked()) {
                            System.out.println(a.Name + ": " + a.Unlocked);
                        }

                    });
                })
                .setNegativeButton("Cancel", (dialog, id) -> dismiss());


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

}
