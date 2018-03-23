package server;

import java.util.List;

/**
 * Event Class. Contains data about a single comedy event.
 * Also Steven if you're reading this, hi :D
 */
public class Event {

    private String title;
    private List<String> lineup;
    private String startDate;
    private String venue;   // TODO should be its own object
    private String ticketUrl;   //TODO can be many url's
    private String imageUrl;

    public Event(String title, List<String> lineup, String startDate, String venue, String ticketUrl, String imageUrl) {
        this.title = title;
        this.lineup = lineup;
        this.startDate = startDate;
        this.venue = venue;
        this.ticketUrl = ticketUrl;
        this.imageUrl = imageUrl;
    }

    public String getTitle() {
        return title;
    }

    public List<String> getLineup() {
        return lineup;
    }

    public String getStartDate() {
        return startDate;
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
