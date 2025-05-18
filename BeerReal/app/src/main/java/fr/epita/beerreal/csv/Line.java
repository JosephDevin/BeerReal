package fr.epita.beerreal.csv;

import android.annotation.SuppressLint;

public class Line {

    public String Picture;
    public String Title;
    public String Brand;
    public float Volume;
    public float Price;
    public double[] Location;
    public String Date;
    public float Rating;
    public String Bar;

    public Line(String picture, String title, String brand, float volume, float price, double latitude, double longitude, String date, float rating, String bar) {
        Picture = picture;
        Title = title;
        Brand = brand;
        Volume = volume;
        Price = price;
        Location = new double[] {latitude, longitude};
        Date = date;
        Rating = rating;
        Bar = bar;

        if (bar.isEmpty()) {
            Bar = "Outside";
        }
    }

    @SuppressLint("DefaultLocale")
    @Override
    public String toString() {
        return "🍺 Beer Entry\n" +
                "------------------------------\n" +
                "📸 Picture: " + Picture + "\n" +
                "🏷️ Title: " + Title + "\n" +
                "🏭 Brand: " + Brand + "\n" +
                "🍶 Volume: " + Volume + " L\n" +
                "💶 Price: " + String.format("%.2f", Price) + " €\n" +
                "📍 Location: (" +
                (Location != null && Location.length == 2
                        ? String.format("%.5f, %.5f", Location[0], Location[1])
                        : "Unknown") + ")\n" +
                "📅 Date: " + Date + "\n" +
                "⭐ Rating: " + Rating + " / 5.0\n" +
                "🏠 Bar: " + Bar;
    }

}
