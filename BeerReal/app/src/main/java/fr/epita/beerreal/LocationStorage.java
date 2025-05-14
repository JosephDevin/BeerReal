package fr.epita.beerreal;

import android.Manifest;
import android.content.Context;
import android.content.pm.PackageManager;

import androidx.core.app.ActivityCompat;

import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationServices;

import java.util.Random;

public class LocationStorage {
    private static double latitude;
    private static double longitude;

    public static void saveLocation(double lat, double lon) {
        latitude = lat;
        longitude = lon;
    }

    public static double getLatitude() {
        return latitude;
    }

    public static double getLongitude() {
        return longitude;
    }

    public static void RecalculatePosition(Context cxt, LocationCallback callback) {
        getLocation(callback, cxt);
    }


    private static void getLocation(LocationCallback callback, Context context) {
        FusedLocationProviderClient locationProviderClient = LocationServices.getFusedLocationProviderClient(context);

        if (ActivityCompat.checkSelfPermission(context, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED
                || ActivityCompat.checkSelfPermission(context, Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED) {

            locationProviderClient.getLastLocation()
                    .addOnSuccessListener(location -> {
                        if (location != null) {
                            callback.onLocationReceived(location.getLatitude(), location.getLongitude());
                        } else {
                            callback.onLocationReceived(0, 0);
                        }
                    });
        } else {
            callback.onLocationReceived(0, 0);
        }
    }

    public static double[] addNoiseToCoordinates(double latitude, double longitude) {
        Random rand = new Random();

        double noiseFactor = 0.0001;

        double noisyLatitude = latitude + (rand.nextDouble() * 2 * noiseFactor - noiseFactor);
        double noisyLongitude = longitude + (rand.nextDouble() * 2 * noiseFactor - noiseFactor);

        return new double[] { noisyLatitude, noisyLongitude };
    }

}
