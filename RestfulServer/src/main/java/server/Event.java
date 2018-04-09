package server;

import java.util.List;

/**
 * Event Class. Contains data about a single comedy event.
 * Also Steven if you're reading this, hi :D
 */
public class Event {

    private int id;
    private String headline;
    private List<String> lineup; //Can be empty
    private String date;
    private String venue;   // TODO should be its own object
    private String ticketUrl;   //TODO can be many url's
    private String imageUrl;

    public Event(int id, String headline, List<String> lineup, String date, String venue, String ticketUrl, String imageUrl) {
        this. id = id;
        this.headline = headline;
        this.lineup = lineup;
        this.date = date;
        this.venue = venue;
        this.ticketUrl = ticketUrl;
        this.imageUrl = imageUrl;
    }

    public int getId() {
        return id;
    }

    public String getHeadline() {
        return headline;
    }

    public List<String> getLineup() {
        return lineup;
    }

    public String getDate() {
        return date;
    }

    public String getVenue() {
        return venue;
    }

    public String getTicketUrl() {
        return ticketUrl;
    }

    public String getImageUrl() {
        return imageUrl;
    }
}
