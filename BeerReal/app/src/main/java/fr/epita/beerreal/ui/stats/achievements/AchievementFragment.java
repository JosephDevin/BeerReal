package fr.epita.beerreal.ui.stats.achievements;

import android.app.AlertDialog;
import android.app.Dialog;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.os.Handler;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.PopupWindow;
import android.widget.TextView;

import androidx.fragment.app.DialogFragment;


import fr.epita.beerreal.MainActivity;
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
        customTitle.setText("\uD83C\uDFC6 Achievements");

        AlertDialog.Builder builder = new AlertDialog.Builder(getActivity());
        builder.setCustomTitle(customTitle)
                .setView(view);

        LinearLayout unlocked = view.findViewById(R.id.unlockedLayout);
        for (Achievement a : MainActivity.achievements.GetAllUnlocked()) {
            TextView textView = new TextView(getContext());
            textView.setText(a.Name);
            textView.setTextColor(Color.rgb(184, 184, 184));
            textView.setGravity(Gravity.START| Gravity.TOP);
            textView.setTextSize(18);
            textView.setHeight(100);
            unlocked.addView(textView);

            textView.setOnClickListener(v -> showTooltip(v, a.Description));
        }

        LinearLayout locked = view.findViewById(R.id.lockedLayout);
        for (Achievement a : MainActivity.achievements.GetAllLocked()) {
            TextView textView = new TextView(getContext());
            textView.setText(a.Name);
            textView.setTextColor(Color.rgb(184, 184, 184));
            textView.setGravity(Gravity.START | Gravity.TOP);
            textView.setTextSize(18);
            textView.setHeight(100);
            locked.addView(textView);

            textView.setOnClickListener(v -> showTooltip(v, a.Description));
        }


        return builder.create();
    }

    private void showTooltip(View anchor, String text) {
        View tooltipView = LayoutInflater.from(anchor.getContext())
                .inflate(R.layout.tooltip, null);

        TextView tooltipText = tooltipView.findViewById(R.id.tooltipText);
        tooltipText.setText(text);

        final PopupWindow popup = new PopupWindow(
                tooltipView,
                ViewGroup.LayoutParams.WRAP_CONTENT,
                ViewGroup.LayoutParams.WRAP_CONTENT,
                true
        );

        popup.setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
        popup.setElevation(10f);
        popup.setOutsideTouchable(true);

        tooltipView.setAlpha(0f);
        tooltipView.animate().alpha(1f).setDuration(150).start();

        popup.showAsDropDown(anchor, 0, -anchor.getHeight() + 100);

        new Handler().postDelayed(popup::dismiss, 2000);
    }



    /*

    # QUANTITY GOALS
    Fighter: 5 Pints
    Warrior: 10 Pints
    War general: 25 Pints
    Marathon runner: 42.195 Pints
    The 100th: 100 beers
    King of the Keg: Drink 2L in one glass

    # STREAKS
    Beer week: Longest streak of 7 days
    Alcoholic: Longest streak of 15 days
    Ubermensch: Longest streak of 31 days

    # QUANTITY IN A GIVEN TIME
    The Trifecta: 3 beers in a day
    Five pint plan: 5 beers in a day
    : 10 beers in a day
    : Drink 2 beers in a 10 minutes interval
    : Drink 2 beers in a 1 minute interval

    # BEER AT ALL TIMES
    Make day drinking great again: Drink before noon (and after 8AM)
    Night owl: Drink a beer between midnight and 3AM
    Vivaldi's beer: Drink at least one beer in 4 different seasons
    Happy Hour Hunter: Drink 5 beers between 6PM to 8PM

    # CHEAP AND EXPENSIVE
    What a gift!: Drink a free beer
    Money saver: Drink a less than 1€ beer
    Fancy beer: Drink a more than 10€ beer
    Gold brew: Drink a more than 20€ beer
    Price Shock: Drink a beer that costs 10 times more than your cheapest beer
    Value Seeker: Rate 5 stars a less than 1€ beer

    # BEER ON HOLIDAYS
    Globe trotter: Drink a beer in another country
    On The Road: Drink beer at a latitude difference of 1000+ km from your hometown (defined as where you were at the launch of the app)

    # DIFFERENT BARS
    Bar Hopper: Drink beers in 10 different bars/locations
    Bar Explorer: Visit and drink in 20 unique bars/locations
    Bar Conqueror: Visit and drink in 50 unique bars/locations

    # BEER CONNOISSEUR
    Piss Drinker: Rate a beer 0 stars
    Connoisseur: Rate 10 beers 4 stars or above
    Critic: Rate 5 beers 2 stars or below
    Rising Star: Rate a newly discovered beer with 5 stars

    # SPECIAL DAYS
    Santa's Little Helper: Christmas
    Spooky beer: Halloween
    Revolution!: 14 Juillet
    Look! A swallow!: Drink on the first day of Spring
    Cold one on a hot day: Drink on the first day of Summer
     */

}
