package fr.epita.beerreal.ui.stats;

import android.app.AlertDialog;
import android.app.Dialog;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;

import androidx.fragment.app.DialogFragment;


import fr.epita.beerreal.R;

public class AchievementFragment extends DialogFragment {


    public static AchievementFragment newInstance() {

        return new AchievementFragment();
    }

    public Dialog onCreateDialog(Bundle saved) {
        LayoutInflater inflater = getActivity().getLayoutInflater();
        View view = inflater.inflate(R.layout.fragment_achievements, null);

        AlertDialog.Builder builder = new AlertDialog.Builder(getActivity());
        builder.setTitle("Achievements")
                .setView(view);

        return builder.create();
    }

}
