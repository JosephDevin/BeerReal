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

import fr.epita.beerreal.csv.Line;
import fr.epita.beerreal.R;
import fr.epita.beerreal.csv.CsvHelper;
import fr.epita.beerreal.databinding.FragmentMapBinding;
import fr.epita.beerreal.ui.menu.ViewPhotoFragment;

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

        Configuration.getInstance().setUserAgentValue(requireContext().getPackageName());

        mapView.setTileSource(org.osmdroid.tileprovider.tilesource.TileSourceFactory.MAPNIK);
        mapView.setMultiTouchControls(true);

        mapView.getController().setZoom(15);

        LocationStorage.RecalculatePosition(requireContext(), ((latitude, longitude) -> {
            mapView.getController().setCenter(new GeoPoint(latitude, longitude));
        }));

        LoadBeers();
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



    public void LoadBeers() {
        ArrayList<Line> lines = CsvHelper.GetLinesCsv(requireContext());
        mapView = mapView.findViewById(R.id.map);

        if (lines == null) {
            return;
        }

        Drawable d = ContextCompat.getDrawable(requireContext(), R.drawable.beer_location_pin);

        for (Line l:lines) {
            double[] cords = LocationStorage.addNoiseToCoordinates(l.Location[0], l.Location[1]);
            GeoPoint beer = new GeoPoint(cords[0], cords[1]);

            Marker m = new Marker(mapView);
            m.setPosition(beer);
            m.setTitle(l.Title + l.Date);
            m.setIcon(d);

            m.setOnMarkerClickListener((Marker marker, MapView map) -> {
                LoadPicture(l);
                return true;
            });

            mapView.getOverlays().add(m);
        }
    }




    private void ReloadCords() {
        LocationStorage.RecalculatePosition(requireContext(), (latitude, longitude) -> {

            mapView.getController().animateTo(new GeoPoint(latitude, longitude));
            mapView.getController().stopAnimation(true);
        });
    }


    private void LoadPicture(Line l) {
        ViewPhotoFragment beerMenuFragment = ViewPhotoFragment.newInstance(l, this);
        beerMenuFragment.show(getParentFragmentManager(), "ViewPhotoFragment");
    }

    public void ClearAllMarkers() {
        for (int i = mapView.getOverlays().size() - 1; i >= 0; i--) {
            if (mapView.getOverlays().get(i) instanceof Marker) {
                mapView.getOverlays().remove(i);
            }
        }
        mapView.invalidate(); // Refresh the map view
    }

}
