package fr.epita.beerreal.ui.stats;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;

import org.json.JSONException;

import java.io.IOException;

import fr.epita.beerreal.Data;
import fr.epita.beerreal.Times;
import fr.epita.beerreal.csv.CsvHelper;
import fr.epita.beerreal.databinding.FragmentStatsBinding;

public class StatsFragment extends Fragment {

    private FragmentStatsBinding binding;

    private Times time;

    @SuppressLint("DefaultLocale")
    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        binding = FragmentStatsBinding.inflate(inflater, container, false);

        Data data = new Data(requireContext(), Times.WEEK);

        // MAY LOOK SCARY BUT ONLY LOADING THE DATA INTO THE VIEW

        binding.tvTotalBeers.setText(String.format("%s %d", binding.tvTotalBeers.getText(), data.GetTotalBeers()));
        binding.tvTotalCost.setText(String.format("%s %.2f€", binding.tvTotalCost.getText(), data.GetTotalCost()));
        binding.tvTotalVolume.setText(String.format("%s %.2f L", binding.tvTotalVolume.getText(), data.GetTotalVolume()));
        binding.tvAverageSatisfaction.setText(String.format("%s %.1f / 5", binding.tvAverageSatisfaction.getText(), data.GetAverageSatisfaction()));

        binding.tvBeersPerDay.setText(String.format("%s %.2f", binding.tvBeersPerDay.getText(), data.GetAverageDrinksPerDay()));
        binding.tvCostPerDay.setText(String.format("%s %.2f€", binding.tvCostPerDay.getText(), data.GetAverageCostPerDay()));
        binding.tvVolumePerDay.setText(String.format("%s %.2f L", binding.tvVolumePerDay.getText(), data.GetAverageVolumePerDay()));

        binding.tvFavoriteBar.setText(String.format("%s %s", binding.tvFavoriteBar.getText(), data.GetFavoriteBar()));
        binding.tvFavoriteBrand.setText(String.format("%s %s", binding.tvFavoriteBrand.getText(), data.GetFavoriteBrand()));
        binding.tvFavoriteHour.setText(String.format("%s %s", binding.tvFavoriteHour.getText(), data.GetFavoriteHour()));

        binding.tvLongestDrinkingStreak.setText(String.format("%s %d days", binding.tvLongestDrinkingStreak.getText(), data.GetLongestDrinkingStreak()));
        binding.tvLongestNonDrinkingStreak.setText(String.format("%s %d days", binding.tvLongestNonDrinkingStreak.getText(), data.GetLongestNonDrinkingStreak()));

        binding.tvAvgCostPerBeer.setText(String.format("%s %.2f€", binding.tvAvgCostPerBeer.getText(), data.GetAverageCost()));
        binding.tvCheapestBeer.setText(String.format("%s\n %s", binding.tvCheapestBeer.getText(), data.GetCheapestBeer()));
        binding.tvMostExpensiveBeer.setText(String.format("%s\n %s", binding.tvMostExpensiveBeer.getText(), data.GetMostExpensiveBeer()));

        binding.tvEstimatedCalories.setText(String.format("%s %.0f kcal", binding.tvEstimatedCalories.getText(), data.GetCaloricIntakeFromBeer()));
        binding.tvAlcoholUnits.setText(String.format("%s %.1f", binding.tvAlcoholUnits.getText(), data.GetAlcoholUnitsConsumed()));

        float[] countries = data.CompareToWorldsDrinkers();
        binding.tvRomaniaRatio.setText(String.format("%s %.1fx", binding.tvRomaniaRatio.getText(), countries[0]));
        binding.tvGeorgiaRatio.setText(String.format("%s %.1fx", binding.tvGeorgiaRatio.getText(), countries[1]));
        binding.tvLatviaRatio.setText(String.format("%s %.1fx", binding.tvLatviaRatio.getText(), countries[2]));
        binding.tvFranceRatio.setText(String.format("%s %.1fx", binding.tvFranceRatio.getText(), countries[3]));
        binding.tvIrelandRatio.setText(String.format("%s %.1fx", binding.tvIrelandRatio.getText(), countries[4]));
        binding.tvUSARatio.setText(String.format("%s %.1fx", binding.tvUSARatio.getText(), countries[5]));
        binding.tvBangladeshRatio.setText(String.format("%s %.1fx", binding.tvBangladeshRatio.getText(), countries[6]));
        try {
            binding.tvClosestCountry.setText(String.format("%s %s", binding.tvClosestCountry.getText(), data.ClosestComparison(requireContext())));
        } catch (JSONException e) {
            throw new RuntimeException(e);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return binding.getRoot();
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
