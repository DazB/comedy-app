package server;

import java.util.List;


/**
 * Event Class. Contains data about a single comedy event.
 * TODO: one event could have many ticket urls. How manage that?
 * Also Steven if you're reading this, hi :D
 */
public class Event {

    private String headline;
    private List<String> lineup;
    private String startDate;
    private String venue;   // TODO could be its own object?
    private String ticketUrl;
    private String imageUrl;

    public Event(String headline, List<String> lineup, String startDate, String venue, String ticketUrl, String imageUrl) {
        this.headline = headline;
        this.lineup = lineup;
        this.startDate = startDate;
        this.venue = venue;
        this.ticketUrl = ticketUrl;
        this.imageUrl = imageUrl;
    }

    public String getHeadline() {
        return headline;
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
