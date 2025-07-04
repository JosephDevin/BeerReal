package fr.epita.beerreal.ui.map;

import android.Manifest;
import android.content.Context;
import android.content.pm.PackageManager;
import android.util.Log;

import androidx.core.app.ActivityCompat;

import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationServices;

import java.util.Random;

public class LocationStorage {

    public static void RecalculatePosition(Context cxt, LocationCallback callback) {
        GetLocation(callback, cxt);
    }


    private static void GetLocation(LocationCallback callback, Context context) {
        FusedLocationProviderClient locationProviderClient = LocationServices.getFusedLocationProviderClient(context);

        if (ActivityCompat.checkSelfPermission(context, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED
                || ActivityCompat.checkSelfPermission(context, Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED) {

            locationProviderClient.getLastLocation()
                    .addOnSuccessListener(location -> {
                        try {
                            if (location != null) {
                                callback.onLocationReceived(location.getLatitude(), location.getLongitude());
                            } else {
                                callback.onLocationReceived(0, 0);
                            }
                        } catch (Exception e) {
                            Log.e("Location", "Error in success listener", e);
                        }
                    });
        } else {
            callback.onLocationReceived(0, 0);
        }
    }

    public static double[] AddNoiseToCoordinates(double latitude, double longitude) {
        Random rand = new Random();

        double noiseFactor = 0.00001;

        double noisyLatitude = latitude + (rand.nextDouble() * 2 * noiseFactor - noiseFactor);
        double noisyLongitude = longitude + (rand.nextDouble() * 2 * noiseFactor - noiseFactor);

        return new double[] { noisyLatitude, noisyLongitude };
    }

}
