import '../../css/home/beerCard.css';

export class FeedItem {
    constructor(imageUrl, line) {
        this.imageUrl = imageUrl;
        this.line     = line;
    }

    getImageUrl() { return this.imageUrl; }
    getLine()     { return this.line; }
}