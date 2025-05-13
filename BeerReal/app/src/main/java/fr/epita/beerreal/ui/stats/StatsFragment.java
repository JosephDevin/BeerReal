package fr.epita.beerreal.ui.stats;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;

import fr.epita.beerreal.csv.CsvHelper;
import fr.epita.beerreal.databinding.FragmentStatsBinding;

public class StatsFragment extends Fragment {

    private FragmentStatsBinding binding;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        binding = FragmentStatsBinding.inflate(inflater, container, false);

        Button reset = binding.resetButton;
        reset.setOnClickListener((View v) -> CsvHelper.ResetApp(requireContext()));

        return binding.getRoot();
    }

    /*

    Drop down menu: Week - Month - Year (Default) - All time

        TOTALS:

        Numbers of beers: INT
        Total cost: DOUBLE EUR/USD
        Total volume: DOUBLE L
        Average satisfaction: FLOAT stars
        Total number of different bar visited = INT

        AVERAGE PER DAY:

        Average number of drinks per day: FLOAT
        Average cost of drinks per day: FLOAT EUR/USD

        FAVORITES:

        Favorite bar: STRING + INT drinks
        Favorite brand: STRING + INT drinks
        Favorite location: PIN TO THE MAP

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

        Title, Brand, Volume, Price, Location, Date, Bar, Rating
     */

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}
