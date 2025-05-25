package fr.epita.beerreal.ui.home;

import fr.epita.beerreal.csv.Line;

public class FeedItem {
    private String imageUrl;  // or local path, URI etc.
    private String feedText;
    private Line line;

    public FeedItem(String imageUrl, String feedText, Line line) {
        this.imageUrl = imageUrl;
        this.feedText = feedText;
        this.line = line;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public Line getLine() {
        return line;
    }
}



