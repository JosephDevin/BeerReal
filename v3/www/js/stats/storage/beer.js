export function createBeer(picture, title, brand, volume, price, latitude, longitude, date, rating, bar) {
    return {
        Picture:  picture,
        Title:    title,
        Brand:    brand,
        Volume:   parseFloat(volume),
        Price:    parseFloat(price),
        Location: [parseFloat(latitude), parseFloat(longitude)],
        Date:     date,
        Rating:   parseFloat(rating),
        Bar:      bar?.trim() === '' ? 'Outside' : bar,

        toString() {
            return (
                `🍺 Beer Entry\n` +
                `------------------------------\n` +
                `📸 Picture: ${this.Picture}\n` +
                `🏷️ Title: ${this.Title}\n` +
                `🏭 Brand: ${this.Brand}\n` +
                `🍶 Volume: ${this.Volume} L\n` +
                `💶 Price: ${this.Price.toFixed(2)} €\n` +
                `📍 Location: (${this.Location ? `${this.Location[0].toFixed(5)}, ${this.Location[1].toFixed(5)}` : 'Unknown'})\n` +
                `📅 Date: ${this.Date}\n` +
                `⭐ Rating: ${this.Rating} / 5.0\n` +
                `🏠 Bar: ${this.Bar}`
            );
        }
    };
}