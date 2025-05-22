package fr.epita.beerreal.ui.stats;

import android.app.AlertDialog;
import android.app.Dialog;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.PopupWindow;
import android.widget.TextView;

import androidx.fragment.app.DialogFragment;


import fr.epita.beerreal.R;

public class AchievementFragment extends DialogFragment {


    public static AchievementFragment newInstance() {

        return new AchievementFragment();
    }

    @Override
    public Dialog onCreateDialog(Bundle savedInstanceState) {
        LayoutInflater inflater = getActivity().getLayoutInflater();
        View view = inflater.inflate(R.layout.fragment_achievements, null);

        TextView customTitle = (TextView) inflater.inflate(R.layout.dialog_title, null);
        customTitle.setText("Achievements");

        AlertDialog.Builder builder = new AlertDialog.Builder(getActivity());
        builder.setCustomTitle(customTitle)
                .setView(view);

        TextView tv = view.findViewById(R.id.achievement_title);

        tv.setOnLongClickListener(v -> {
            View tooltipView = LayoutInflater.from(v.getContext())
                    .inflate(R.layout.tooltip, null);

            TextView tooltipText = tooltipView.findViewById(R.id.tooltip_text);
            tooltipText.setText("Unlock by drinking 10 unique beers");

            PopupWindow popup = new PopupWindow(
                    tooltipView,
                    ViewGroup.LayoutParams.WRAP_CONTENT,
                    ViewGroup.LayoutParams.WRAP_CONTENT,
                    true
            );

            popup.setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
            popup.setOutsideTouchable(true);
            popup.showAsDropDown(tv);

            return true;
        });

        return builder.create();
    }


    /*

    Fighter: 5 Pints
    Warrior: 10 Pints
    War general: 25 Pints
    The 100th: 100 beers

    : Longest streak of 7 days
    : Longest streak of 15 days
    Ubermensch: Longest streak of 31 days

    : 3 beers in a day
    : 5 beers in a day
    : 10 beers in a day

    : Drink before noon (and after 8AM)

    : Drink a less than 1€ beer
    : Drink a more than 10€ beer

    : Drink a beer in another country

    : Drink 2 beers in a 10 minutes interval
    : Drink 2 beers in a 1 minute interval

    # JOURS SPECIAUX
    : Christmas
    : 14 Juillet


     */

}
