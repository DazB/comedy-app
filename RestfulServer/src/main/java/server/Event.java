package server;

import java.util.List;

/**
 * Event class. Contains data about a single comedy event.
 */
public class Event {

    private int id;
    private String headline;
    private List<String> lineup; //Can be empty
    private String date;
    private Venue venue;
    private String ticketUrl;   //TODO can be many url's
    private String imageUrl;

    public Event(int id, String headline, List<String> lineup, String date, Venue venue, String ticketUrl, String imageUrl) {
        this.id = id;
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

    public Venue getVenue() {
        return venue;
    }

    public String getTicketUrl() {
        return ticketUrl;
    }

    public String getImageUrl() {
        return imageUrl;
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

