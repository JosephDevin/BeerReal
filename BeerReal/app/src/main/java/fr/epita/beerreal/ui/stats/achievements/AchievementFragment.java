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

        AchievementHandler achievementHandler = new AchievementHandler(getContext());
        achievementHandler.CheckForNewAchievements(false);

        TextView customTitle = (TextView) inflater.inflate(R.layout.dialog_title, null);
        customTitle.setText(R.string.achievements);

        AlertDialog.Builder builder = new AlertDialog.Builder(getActivity());
        builder.setCustomTitle(customTitle)
                .setView(view);

        LinearLayout unlocked = view.findViewById(R.id.unlockedLayout);
        for (Achievement a : MainActivity.achievements.GetAllUnlocked()) {
            TextView textView = new TextView(getContext());
            textView.setText(a.Name);
            textView.setTextColor(Color.WHITE);
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
}
