package fr.epita.beerreal;

import java.util.Date;

public class Line {

    public String Picture;
    public String Title;
    public String Brand;
    public float Volume;
    public float Price;
    public double[] Location;
    public String Date;

    public Line(String picture, String title, String brand, float volume, float price, double latitude, double longitude, String date) {
        Picture = picture;
        Title = title;
        Brand = brand;
        Volume = volume;
        Price = price;
        Location = new double[] {latitude, longitude};
        Date = date;
    }

    public String ToString() {
        return Title + "-" + Brand + "-" + Volume + "-" + Price + "-" + Location[0] +  "," + Location[1] + "-" + Date;
    }

}
