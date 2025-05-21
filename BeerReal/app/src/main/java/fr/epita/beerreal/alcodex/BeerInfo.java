package fr.epita.beerreal.alcodex;

public class BeerInfo {
    public String name;
    public boolean hasImage;
    public String photoPath;

    public BeerInfo() {}

    public BeerInfo(String name, boolean hasImage, String photoPath) {
        this.name = name;
        this.hasImage = hasImage;
        this.photoPath = photoPath;
    }
}
