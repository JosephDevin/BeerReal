package fr.epita.beerreal.ui.home;


import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;

import java.util.List;

import fr.epita.beerreal.R;
import fr.epita.beerreal.csv.Line;

public class FeedAdapter extends RecyclerView.Adapter<FeedAdapter.FeedViewHolder> {
    private List<FeedItem> FeedItems;
    private OnItemClickListener listener;
    private Line line;

    public FeedAdapter(List<FeedItem> feedItems, OnItemClickListener listener) {
        this.FeedItems = feedItems;
        this.listener = listener;
    }

    @NonNull
    @Override
    public FeedViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_feed, parent, false);
        return new FeedViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull FeedViewHolder holder, int position) {
        FeedItem item = FeedItems.get(position);
        String title = item.getLine().Title;
        String date = item.getLine().Date.substring(5, 10);

        holder.titleText.setText(title);
        holder.dateText.setText(date);

        Glide.with(holder.photoImageView.getContext())
                .load(item.getImageUrl())
                .centerCrop()
                .into(holder.photoImageView);

        holder.itemView.setOnClickListener(v -> listener.onItemClick(item));
    }

    @Override
    public int getItemCount() {
        return FeedItems.size();
    }

    public interface OnItemClickListener {
        void onItemClick(FeedItem item);
    }

    public static class FeedViewHolder extends RecyclerView.ViewHolder {
        ImageView photoImageView;
        TextView titleText;
        TextView dateText;

        public FeedViewHolder(@NonNull View itemView) {
            super(itemView);
            photoImageView = itemView.findViewById(R.id.photoImageView);
            titleText = itemView.findViewById(R.id.titleText);
            dateText = itemView.findViewById(R.id.dateText);
        }
    }

}

