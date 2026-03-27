package fr.epita.beerreal.ui.stats;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewTreeObserver;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;

import org.json.JSONException;

import java.io.IOException;

import fr.epita.beerreal.ui.stats.alcodex.AlcodexFragment;
import fr.epita.beerreal.ui.stats.data.Data;
import fr.epita.beerreal.R;
import fr.epita.beerreal.ui.stats.data.Times;
import fr.epita.beerreal.databinding.FragmentStatsBinding;
import fr.epita.beerreal.ui.stats.achievements.AchievementFragment;

public class StatsFragment extends Fragment {

    private FragmentStatsBinding binding;
    private Data data;
    private Times currentPeriod = Times.ALL_TIME;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        binding = FragmentStatsBinding.inflate(inflater, container, false);

        data = new Data(requireContext(), currentPeriod);
        LoadData(binding);

        // ── Pill selector wiring ──
        binding.pillWeek.setOnClickListener(v -> selectPill(Times.WEEK));
        binding.pillMonth.setOnClickListener(v -> selectPill(Times.MONTH));
        binding.pillYear.setOnClickListener(v -> selectPill(Times.YEAR));
        binding.pillAllTime.setOnClickListener(v -> selectPill(Times.ALL_TIME));

        updatePillUI(currentPeriod);

        // ── Bottom bar buttons ──
        binding.btnAchievements.setOnClickListener(v -> {
            AchievementFragment achievements = AchievementFragment.newInstance();
            achievements.show(getParentFragmentManager(), "Achievements Fragment");
        });

        binding.btnAlcodex.setOnClickListener(v -> {
            AlcodexFragment alcodex = AlcodexFragment.newInstance(requireContext());
            alcodex.show(getParentFragmentManager(), "Alcodex Fragment");
        });

        return binding.getRoot();
    }

    // ── Pill selection logic ──

    private void selectPill(Times period) {
        if (period == currentPeriod) return;
        currentPeriod = period;
        updatePillUI(period);

        data = new Data(requireContext(), period);
        if (data.Size != 0) {
            LoadData(binding);
        }
    }

    private void updatePillUI(Times period) {
        // Reset all to unselected style
        setPillUnselected(binding.pillWeek);
        setPillUnselected(binding.pillMonth);
        setPillUnselected(binding.pillYear);
        setPillUnselected(binding.pillAllTime);

        // Highlight the active pill
        switch (period) {
            case WEEK:
                setPillSelected(binding.pillWeek);
                break;
            case MONTH:
                setPillSelected(binding.pillMonth);
                break;
            case YEAR:
                setPillSelected(binding.pillYear);
                break;
            case ALL_TIME:
                setPillSelected(binding.pillAllTime);
                break;
        }
    }

    private void setPillSelected(android.widget.TextView pill) {
        pill.setBackgroundResource(R.drawable.pill_selected_bg);
        pill.setTextColor(0xFF0D0D0D);
    }

    private void setPillUnselected(android.widget.TextView pill) {
        pill.setBackgroundResource(android.R.color.transparent);
        pill.setTextColor(0xFF888888);
    }

    // ── Data loading ──

    @SuppressLint("DefaultLocale")
    private void LoadData(FragmentStatsBinding binding) {

        // Totals
        binding.tvTotalBeers.setText(String.valueOf(data.GetTotalBeers()));
        binding.tvTotalCost.setText(String.format("%.2f€", data.GetTotalCost()));
        binding.tvTotalVolume.setText(String.format("%.2f L", data.GetTotalVolume()));
        binding.tvAverageSatisfaction.setText(String.format("%.1f / 5", data.GetAverageSatisfaction()));

        // Daily averages
        binding.tvBeersPerDay.setText(String.format("%.2f", data.GetAverageDrinksPerDay()));
        binding.tvCostPerDay.setText(String.format("%.2f€", data.GetAverageCostPerDay()));
        binding.tvVolumePerDay.setText(String.format("%.2f L", data.GetAverageVolumePerDay()));

        // Favorites
        binding.tvFavoriteBar.setText(data.GetFavoriteBar());
        binding.tvFavoriteBrand.setText(data.GetFavoriteBrand());
        binding.tvFavoriteHour.setText(data.GetFavoriteHour());

        // Most
        binding.tvMostBar.setText(data.GetMostBar());
        binding.tvMostBrand.setText(data.GetMostBrand());
        binding.tvMostHour.setText(data.GetMostHour());

        // Streaks
        int drinkStreak = data.GetLongestDrinkingStreak();
        int soberStreak = data.GetLongestNonDrinkingStreak();

        binding.tvLongestDrinkingStreak.setText(String.format("%d days", drinkStreak));
        binding.tvLongestNonDrinkingStreak.setText(String.format("%d days", soberStreak));

        // Animate streak progress bars after layout is measured
        int maxStreak = Math.max(drinkStreak, soberStreak);
        if (maxStreak > 0) {
            animateProgressBar(binding.progressDrinkingStreak, drinkStreak, maxStreak);
            animateProgressBar(binding.progressSoberStreak, soberStreak, maxStreak);
        }

        // Cost breakdown
        binding.tvAvgCostPerBeer.setText(String.format("%.2f€", data.GetAverageCost()));
        binding.tvCheapestBeer.setText(data.GetCheapestBeer());
        binding.tvMostExpensiveBeer.setText(data.GetMostExpensiveBeer());

        // Health
        binding.tvEstimatedCalories.setText(String.format("%.0f kcal", data.GetCaloricIntakeFromBeer()));
        binding.tvAlcoholUnits.setText(String.format("%.1f units", data.GetAlcoholUnitsConsumed()));

        // Global comparison bars
        float[] countries = data.CompareToWorldsDrinkers();
        // countries: [Romania, Georgia, Latvia, France, Ireland, USA, Bangladesh]

        // Clamp ratios for bar width: cap at 3x to avoid bars flying off screen
        float maxRatio = 3f;
        setCountryBar(binding.tvRomaniaRatio,   binding.barRomania,    countries[0], maxRatio);
        setCountryBar(binding.tvGeorgiaRatio,   binding.barGeorgia,    countries[1], maxRatio);
        setCountryBar(binding.tvLatviaRatio,    binding.barLatvia,     countries[2], maxRatio);
        setCountryBar(binding.tvFranceRatio,    binding.barFrance,     countries[3], maxRatio);
        setCountryBar(binding.tvIrelandRatio,   binding.barIreland,    countries[4], maxRatio);
        setCountryBar(binding.tvUSARatio,       binding.barUSA,        countries[5], maxRatio);
        setCountryBar(binding.tvBangladeshRatio,binding.barBangladesh, countries[6], maxRatio);

        try {
            binding.tvClosestCountry.setText(data.ClosestComparison(requireContext()));
        } catch (JSONException | IOException e) {
            binding.tvClosestCountry.setText("—");
        }
    }

    /**
     * Animates a horizontal progress bar to fill a fraction of its parent width.
     * Uses post() so the layout has been measured first.
     */
    private void animateProgressBar(View bar, int value, int max) {
        View parent = (View) bar.getParent();
        parent.getViewTreeObserver().addOnGlobalLayoutListener(new ViewTreeObserver.OnGlobalLayoutListener() {
            @Override
            public void onGlobalLayout() {
                parent.getViewTreeObserver().removeOnGlobalLayoutListener(this);
                int parentWidth = parent.getWidth();
                float fraction = Math.min((float) value / max, 1f);
                int targetWidth = (int) (parentWidth * fraction);

                android.animation.ValueAnimator anim = android.animation.ValueAnimator.ofInt(0, targetWidth);
                anim.setDuration(600);
                anim.setInterpolator(new android.view.animation.DecelerateInterpolator());
                anim.addUpdateListener(animation -> {
                    ViewGroup.LayoutParams params = bar.getLayoutParams();
                    params.width = (int) animation.getAnimatedValue();
                    bar.setLayoutParams(params);
                });
                anim.start();
            }
        });
    }

    /**
     * Sets ratio label text and triggers animated bar fill.
     * ratio > 1 → drinking more than that country, < 1 → less.
     * Bar width is clamped to maxRatio.
     */
    @SuppressLint("DefaultLocale")
    private void setCountryBar(android.widget.TextView label, View bar, float ratio, float maxRatio) {
        label.setText(String.format("%.1fx", ratio));

        // Colour: > 1.5x amber, < 0.75x green, else neutral white
        if (ratio > 1.5f) {
            label.setTextColor(0xFFFBB122);
        } else if (ratio < 0.75f) {
            label.setTextColor(0xFF4CAF8B);
        } else {
            label.setTextColor(0xFFFFFFFF);
        }

        View parent = (View) bar.getParent();
        parent.getViewTreeObserver().addOnGlobalLayoutListener(new ViewTreeObserver.OnGlobalLayoutListener() {
            @Override
            public void onGlobalLayout() {
                parent.getViewTreeObserver().removeOnGlobalLayoutListener(this);
                int parentWidth = parent.getWidth();
                float fraction = Math.min(ratio / maxRatio, 1f);
                int targetWidth = (int) (parentWidth * fraction);

                android.animation.ValueAnimator anim = android.animation.ValueAnimator.ofInt(0, targetWidth);
                anim.setDuration(500);
                anim.setInterpolator(new android.view.animation.DecelerateInterpolator());
                anim.addUpdateListener(animation -> {
                    ViewGroup.LayoutParams params = bar.getLayoutParams();
                    params.width = (int) animation.getAnimatedValue();
                    bar.setLayoutParams(params);
                });
                anim.start();
            }
        });
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}