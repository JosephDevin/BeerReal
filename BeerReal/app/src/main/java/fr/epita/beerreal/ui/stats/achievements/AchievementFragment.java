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

import androidx.core.content.ContextCompat;
import androidx.fragment.app.DialogFragment;


import java.util.List;

import fr.epita.beerreal.MainActivity;
import fr.epita.beerreal.R;

public class AchievementFragment extends DialogFragment {

    public static AchievementFragment newInstance() {
        return new AchievementFragment();
    }

    @Override
    public void onStart() {
        super.onStart();
        // Apply rounded corners to the dialog window itself
        if (getDialog() != null && getDialog().getWindow() != null) {
            getDialog().getWindow().setBackgroundDrawable(
                    ContextCompat.getDrawable(requireContext(), R.drawable.bg_dialog_rounded)
            );
        }
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
        List<Achievement> unlockedList = MainActivity.achievements.GetAllUnlocked();
        for (int i = 0; i < unlockedList.size(); i++) {
            Achievement a = unlockedList.get(i);

            TextView textView = new TextView(getContext());
            textView.setText(a.Name);
            textView.setTextColor(Color.WHITE);
            textView.setGravity(Gravity.START | Gravity.CENTER_VERTICAL);
            textView.setTextSize(18);
            textView.setPadding(8, 24, 8, 24);
            unlocked.addView(textView);
            textView.setOnClickListener(v -> showTooltip(v, a.Description));

            // Add divider between items, not after the last one
            if (i < unlockedList.size() - 1) {
                View divider = new View(getContext());
                LinearLayout.LayoutParams p = new LinearLayout.LayoutParams(
                        LinearLayout.LayoutParams.MATCH_PARENT, 1);
                divider.setLayoutParams(p);
                divider.setBackgroundResource(R.drawable.divider_achievement);
                unlocked.addView(divider);
            }
        }

        LinearLayout locked = view.findViewById(R.id.lockedLayout);
        List<Achievement> lockedList = MainActivity.achievements.GetAllLocked();
        for (int i = 0; i < lockedList.size(); i++) {
            Achievement a = lockedList.get(i);

            TextView textView = new TextView(getContext());
            textView.setText(a.Name);
            textView.setTextColor(Color.rgb(184, 184, 184));
            textView.setGravity(Gravity.START | Gravity.CENTER_VERTICAL);
            textView.setTextSize(18);
            textView.setPadding(8, 24, 8, 24);
            locked.addView(textView);
            textView.setOnClickListener(v -> showTooltip(v, a.Description));

            if (i < lockedList.size() - 1) {
                View divider = new View(getContext());
                LinearLayout.LayoutParams p = new LinearLayout.LayoutParams(
                        LinearLayout.LayoutParams.MATCH_PARENT, 1);
                divider.setLayoutParams(p);
                divider.setBackgroundResource(R.drawable.divider_achievement);
                locked.addView(divider);
            }
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
