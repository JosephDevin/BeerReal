package fr.epita.beerreal.ui.stats;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Spinner;

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
    private String currentSelected = null;


    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        binding = FragmentStatsBinding.inflate(inflater, container, false);

        data = new Data(requireContext(), Times.ALL_TIME);
        LoadData(binding);

        Spinner spinnerHeader = binding.spinnerHeader;
        ArrayAdapter<CharSequence> adapter = ArrayAdapter.createFromResource(
                getContext(),
                R.array.header_options,
                R.layout.spinner_header_item
        );
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinnerHeader.setAdapter(adapter);

        spinnerHeader.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                String selected = parent.getItemAtPosition(position).toString();

                if (!selected.equals(currentSelected)) {
                    currentSelected = selected;

                    switch (selected) {
                        case "Weekly Statbeerstics":
                        case "Statbièrestiques hebdomadaires":
                            data = new Data(requireContext(), Times.WEEK);
                            break;
                        case "Monthly Statbeerstics":
                        case "Statbièrestiques mensuelles":
                            data = new Data(requireContext(), Times.MONTH);
                            break;
                        case "Yearly Statbeerstics":
                        case "Statbièrestiques annuelles":
                            data = new Data(requireContext(), Times.YEAR);
                            break;
                        default:
                            data = new Data(requireContext(), Times.ALL_TIME);
                            break;
                    }

                    if (data.Size != 0) {
                        LoadData(binding);
                    }
                }
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {
                // Optional: Handle no selection
            }
        });


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


    // MAY LOOK SCARY BUT ONLY LOADING THE DATA INTO THE VIEW
    @SuppressLint("DefaultLocale")
    private void LoadData(FragmentStatsBinding binding) {

        binding.tvTotalBeers.setText(String.format("%s %d", getString(R.string.total_beers), data.GetTotalBeers()));
        binding.tvTotalCost.setText(String.format("%s %.2f€", getString(R.string.total_cost), data.GetTotalCost()));
        binding.tvTotalVolume.setText(String.format("%s %.2f L", getString(R.string.total_volume), data.GetTotalVolume()));
        binding.tvAverageSatisfaction.setText(String.format("%s %.1f / 5", getString(R.string.average_satisfaction), data.GetAverageSatisfaction()));

        binding.tvBeersPerDay.setText(String.format("%s %.2f", getString(R.string.beers_day), data.GetAverageDrinksPerDay()));
        binding.tvCostPerDay.setText(String.format("%s %.2f€", getString(R.string.cost_day), data.GetAverageCostPerDay()));
        binding.tvVolumePerDay.setText(String.format("%s %.2f L", getString(R.string.volume_day), data.GetAverageVolumePerDay()));

        binding.tvFavoriteBar.setText(String.format("%s %s", getString(R.string.bar_fav), data.GetFavoriteBar()));
        binding.tvFavoriteBrand.setText(String.format("%s %s", getString(R.string.brand_fav), data.GetFavoriteBrand()));
        binding.tvFavoriteHour.setText(String.format("%s %s", getString(R.string.hour_fav), data.GetFavoriteHour()));

        binding.tvMostBar.setText(String.format("%s %s", getString(R.string.bar_most), data.GetMostBar()));
        binding.tvMostBrand.setText(String.format("%s %s", getString(R.string.brand_most), data.GetMostBrand()));
        binding.tvMostHour.setText(String.format("%s %s", getString(R.string.hour_most), data.GetMostHour()));

        binding.tvLongestDrinkingStreak.setText(String.format("%s %d days", getString(R.string.longest_drinking_streak), data.GetLongestDrinkingStreak()));
        binding.tvLongestNonDrinkingStreak.setText(String.format("%s %d days", getString(R.string.longest_non_drinking_streak), data.GetLongestNonDrinkingStreak()));

        binding.tvAvgCostPerBeer.setText(String.format("%s %.2f€", getString(R.string.avg_cost_per_beer), data.GetAverageCost()));
        binding.tvCheapestBeer.setText(String.format("%s\n %s", getString(R.string.cheapest), data.GetCheapestBeer()));
        binding.tvMostExpensiveBeer.setText(String.format("%s\n %s", getString(R.string.most_expensive), data.GetMostExpensiveBeer()));

        binding.tvEstimatedCalories.setText(String.format("%s %.0f kcal", getString(R.string.estimated_calories), data.GetCaloricIntakeFromBeer()));
        binding.tvAlcoholUnits.setText(String.format("%s %.1f", getString(R.string.alcohol_units), data.GetAlcoholUnitsConsumed()));

        float[] countries = data.CompareToWorldsDrinkers();
        binding.tvRomaniaRatio.setText(String.format("%s %.1fx", getString(R.string.romania), countries[0]));
        binding.tvGeorgiaRatio.setText(String.format("%s %.1fx", getString(R.string.georgia), countries[1]));
        binding.tvLatviaRatio.setText(String.format("%s %.1fx", getString(R.string.latvia), countries[2]));
        binding.tvFranceRatio.setText(String.format("%s %.1fx", getString(R.string.france), countries[3]));
        binding.tvIrelandRatio.setText(String.format("%s %.1fx", getString(R.string.ireland), countries[4]));
        binding.tvUSARatio.setText(String.format("%s %.1fx", getString(R.string.usa), countries[5]));
        binding.tvBangladeshRatio.setText(String.format("%s %.1fx", getString(R.string.bangladesh), countries[6]));
        try {
            binding.tvClosestCountry.setText(String.format("%s %s", getString(R.string.closest_country), data.ClosestComparison(requireContext())));
        } catch (JSONException e) {
            throw new RuntimeException(e);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

    }

    /*

    Drop down menu: Week - Month - Year (Default) - All time

        TOTALS:

        Numbers of beers: INT
        Total cost: FLOAT EUR/USD
        Total volume: FLOAT L
        Average satisfaction: FLOAT stars
        Total number of different bar visited = INT

        AVERAGE PER DAY:

        Average number of drinks per day: FLOAT
        Average cost of drinks per day: FLOAT EUR/USD

        FAVORITES:

        Favorite bar: STRING + INT drinks
        Favorite brand: STRING + INT drinks
        Favorite hour: STRING H + INT drinks

        COST:

        Average cost of a pint: FLOAT EUR/USD
        Cheapest drink: FLOAT EUR/USD
        Most expensive drink: FLOAT EUR/USD

        STREAKS:

        Longest streak with: INT days
        Longest streak without: INT days

        HEALTH RELATED:

        Caloric Intake from Beer: FLOAT
        Alcohol Units Consumed: FLOAT

        NATIONALITY:

        Comparison with a few nationalities: FLOAT nationality-ish person
        Nationality with Highest Consumption Similarity: STRING

        YEARLY VIEW =>
                        Month you drank the most: as a graph
                        Days you drink the most on average
     */

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}
