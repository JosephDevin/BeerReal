package fr.epita.beerreal.ui.map;

import android.content.Context;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.core.content.ContextCompat;
import androidx.fragment.app.Fragment;

import com.google.android.material.floatingactionbutton.FloatingActionButton;

import org.osmdroid.config.Configuration;
import org.osmdroid.views.MapView;
import org.osmdroid.util.GeoPoint;
import org.osmdroid.views.overlay.Marker;

import java.util.ArrayList;

import fr.epita.beerreal.Line;
import fr.epita.beerreal.LocationStorage;
import fr.epita.beerreal.R;
import fr.epita.beerreal.csv.CsvHelper;
import fr.epita.beerreal.databinding.FragmentMapBinding;

public class MapFragment extends Fragment {

    private MapView mapView;
    private FragmentMapBinding binding;

    public MapFragment() {
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        binding = FragmentMapBinding.inflate(inflater, container, false);

        FloatingActionButton reloadButton = binding.reloadButton;
        reloadButton.setOnClickListener(v -> ReloadCords());

        return binding.getRoot();
    }

    @Override
    public void onViewCreated(View view, Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        mapView = view.findViewById(R.id.map);

        // Initialize OSMDroid
        Configuration.getInstance().setUserAgentValue(requireContext().getPackageName());

        mapView.setTileSource(org.osmdroid.tileprovider.tilesource.TileSourceFactory.MAPNIK);
        mapView.setMultiTouchControls(true);


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

        Drawable d = ContextCompat.getDrawable(requireContext(), R.drawable.beer_location_pin);

        for (Line l:lines) {
            GeoPoint beer = new GeoPoint(l.Location[0], l.Location[1]);

            Marker m = new Marker(mapView);
            m.setPosition(beer);
            m.setTitle(l.Title + l.Date);
            m.setIcon(d);

            m.setOnMarkerClickListener((Marker marker, MapView map) -> {
                //LoadPicture();
                System.out.println(l.toString());
                return true;
            });

            mapView.getOverlays().add(m);
        }
    }




    private void ReloadCords() {
        LocationStorage.RecalculatePosition(LocationStorage::saveLocation, requireContext());

        mapView.getController().animateTo(new GeoPoint(LocationStorage.getLatitude(), LocationStorage.getLongitude()));
        mapView.getController().stopAnimation(true);
    }

}
