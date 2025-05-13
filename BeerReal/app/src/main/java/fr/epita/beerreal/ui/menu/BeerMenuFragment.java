package fr.epita.beerreal.ui.menu;

import android.app.AlertDialog;
import android.app.Dialog;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.EditText;
import android.widget.RatingBar;

import androidx.appcompat.widget.AppCompatRatingBar;
import androidx.fragment.app.DialogFragment;

import java.util.Date;

import fr.epita.beerreal.LocationStorage;
import fr.epita.beerreal.R;
import fr.epita.beerreal.csv.CsvHelper;

public class BeerMenuFragment extends DialogFragment {

    public static BeerMenuFragment newInstance(String photoPath) {
        BeerMenuFragment fragment = new BeerMenuFragment();
        Bundle args = new Bundle();
        args.putString("photo_path", photoPath);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public Dialog onCreateDialog(Bundle savedInstanceState) {
        LayoutInflater inflater = getActivity().getLayoutInflater();
        View view = inflater.inflate(R.layout.fragment_menu, null);

        EditText titleInput = view.findViewById(R.id.title_input);
        EditText brandInput = view.findViewById(R.id.brand_input);
        EditText volumeInput = view.findViewById(R.id.volume_input);
        EditText priceInput = view.findViewById(R.id.price_input);
        AppCompatRatingBar ratingInput = view.findViewById(R.id.rating_bar);
        EditText barInput = view.findViewById(R.id.bar_input);

        AlertDialog.Builder builder = new AlertDialog.Builder(getActivity());
        builder.setTitle("Beer Information")
                .setView(view)
                .setPositiveButton("Submit", (dialog, id) -> {
                    CsvHelper.AddLineCsv(
                            "",
                            titleInput.getText().toString(),
                            brandInput.getText().toString(),
                            Float.parseFloat(volumeInput.getText().toString()),
                            Float.parseFloat(priceInput.getText().toString()),
                            new double[] {LocationStorage.getLatitude(), LocationStorage.getLongitude(),},
                            new Date(),
                            ratingInput.getRating(),
                            barInput.getText().toString()
                    );
                })
                .setNegativeButton("Cancel", (dialog, id) -> dismiss());

        return builder.create();
    }
}

