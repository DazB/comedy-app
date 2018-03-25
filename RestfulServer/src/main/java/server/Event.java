package server;

import java.util.List;

/**
 * Event Class. Contains data about a single comedy event.
 * Also Steven if you're reading this, hi :D
 */
public class Event {

    private String title;
    private List<String> lineup;

    //Use private LocalDateTime startdate
    //If you are on an old version of java, import a date library.
    private String startDate;

    //Your right, you want venue to be its own object. That works so that you can search by venue (And its easier to say
    //oh hey these 2 objects are equal than comparing a bunch of springs. Make an object similar to this for venue!
    //Even if it just contains a String, its better. use the intellij Alt+Insert crap
    private String venue;   // TODO should be its own object

    //Collection<String>. Collections can be either Sets or Lists. You wanna have a set if the ordering of the strings in
    //the collection doesnt matter. You wanna be careful for nulls, if you get no ticket URLs, you'll get a nullpointerexception
    //will talk about that more later ;))) (Use a set for this one)
    private String ticketUrl;   //TODO can be many url's

    private String imageUrl;

    //You might have to write some methods that convert String of ticket urls -> A Set of them.
    //For dates, you might just be able to call new LocalDateTime(String) and it might be smart enough to work it out
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
