package server;

import java.util.List;

/**
 * Event class. Contains data about a single comedy event.
 */
public class Event {

    private int id;
    private String title;
    private String headline;
    private List<String> lineup; //Can be empty
    private String date;
    private String time;
    private Venue venue;
    private List<String> ticketUrl;
    private String imageUrl;

    public Event(int id, String title, String headline, List<String> lineup, String date, String time, Venue venue, List<String> ticketUrl, String imageUrl) {
        this.id = id;
        this.title = title;
        this.headline = headline;
        this.lineup = lineup;
        this.date = date;
        this.time = time;
        this.venue = venue;
        this.ticketUrl = ticketUrl;
        this.imageUrl = imageUrl;
    }

    public int getId() {
        return id;
    }

    public String getTitle() {
        return title;
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

    public String getTime() {
        return time;
    }

    public Venue getVenue() {
        return venue;
    }

    public List<String> getTicketUrl() {
        return ticketUrl;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setHeadline(String headline) {
        this.headline = headline;
    }

    public void setLineup(List<String> lineup) {
        this.lineup = lineup;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public void setVenue(Venue venue) {
        this.venue = venue;
    }

    public void setTicketUrl(List<String> ticketUrl) {
        this.ticketUrl = ticketUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    /**
     * Details about a single venue.
     */
    static class Venue {
        private String name;
        private Address address;
        private Location location;

        public Venue(String name, Address address, Location location) {
            this.name = name;
            this.address = address;
            this.location = location;
        }

        public String getName() {
            return name;
        }

        public Address getAddress() {
            return address;
        }

        public Location getLocation() {
            return location;
        }
    }

    /**
     * Address of a single venue.
     */
    static class Address {
        private String road;
        private String postcode;
        private String town;

        public Address(String road, String postcode, String town) {
            this.road = road;
            this.postcode = postcode;
            this.town = town;
        }

        public String getRoad() {
            return road;
        }

        public String getPostcode() {
            return postcode;
        }

        public String getTown() {
            return town;
        }
    }

    /**
     * Longitude and Latitude location of a venue.
     */
    static class Location {
        private String latitude;
        private String longitude;

        public Location(String latitude, String longitude) {
            this.latitude = latitude;
            this.longitude = longitude;
        }

        public String getLatitude() {
            return latitude;
        }

        public String getLongitude() {
            return longitude;
        }
    }
}

