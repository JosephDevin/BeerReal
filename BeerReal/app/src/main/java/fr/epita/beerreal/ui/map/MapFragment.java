package fr.epita.beerreal.ui.map;

import android.content.Context;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.fragment.app.Fragment;
import org.osmdroid.config.Configuration;
import org.osmdroid.views.MapView;
import org.osmdroid.util.GeoPoint;
import org.osmdroid.views.overlay.Marker;

import java.util.ArrayList;

import fr.epita.beerreal.Line;
import fr.epita.beerreal.LocationStorage;
import fr.epita.beerreal.R;
import fr.epita.beerreal.csv.CsvHelper;

public class MapFragment extends Fragment {

    private MapView mapView;

    public MapFragment() {
        // Required empty public constructor
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_map, container, false);
    }

    @Override
    public void onViewCreated(View view, Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        CsvHelper.ResetApp(requireContext());
        System.out.println("App successfully reset");

        mapView = view.findViewById(R.id.map);

        // Initialize OSMDroid
        Configuration.getInstance().setUserAgentValue(requireContext().getPackageName());

        mapView.setTileSource(org.osmdroid.tileprovider.tilesource.TileSourceFactory.MAPNIK);
        mapView.setMultiTouchControls(true);

        // Set initial position and zoom
        mapView.getController().setZoom(15);
        mapView.getController().setCenter(new GeoPoint(LocationStorage.getLatitude(), LocationStorage.getLongitude()));

        // TODO: Create a list of all the beers that have been saved and load them here
        LoadBeers(view);
    }

    @Override
    public void onResume() {
        super.onResume();
        Configuration.getInstance().load(requireContext(), requireActivity().getPreferences(Context.MODE_PRIVATE));
    }

    @Override
    public void onPause() {
        super.onPause();
        Configuration.getInstance().save(requireContext(), requireActivity().getPreferences(Context.MODE_PRIVATE));
    }





    private void LoadBeers(View v) {
        ArrayList<Line> lines = CsvHelper.GetLinesCsv(requireContext());
        mapView = mapView.findViewById(R.id.map);

        if (lines == null) {
            return;
        }

        for (Line l:lines) {
            GeoPoint beer = new GeoPoint(l.Location[0], l.Location[1]);

            Marker marker = new Marker(mapView);
            marker.setPosition(beer);
            marker.setTitle("You drank a beer here");
            mapView.getOverlays().add(marker);
        }
    }

}
