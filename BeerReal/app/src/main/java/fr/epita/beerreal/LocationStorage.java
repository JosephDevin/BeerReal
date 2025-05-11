package fr.epita.beerreal;

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

}
