package server.responses;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonRootName;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.jsonschema.JsonSerializableSchema;
import org.springframework.data.web.JsonPath;

import java.util.List;

/**
 * JSON response from Ents24 API.
 * This POJO represents the structure of the JSON and contains the details we extract from it.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class Ents24Response {

    private String headline;        // headline title of the event
    private List<Artist> artists;   // list of artists performing (can be null)
    private String startDate;       // start date of the event
    private Venue venue;            // venue details (name, address, location) of the event
    private String webLink;         // URL to ents24 web page selling the ticket
    private Image image;            // Image details (can be null?)
    private String country;

    public Ents24Response() {
    }

    public String getHeadline() {
        return headline;
    }

    public void setHeadline(String headline) {
        this.headline = headline;
    }

    public List<Artist> getArtists() {
        return artists;
    }

    public void setArtists(List<Artist> artists) {
        this.artists = artists;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public Venue getVenue() {
        return venue;
    }

    public void setVenue(Venue venue) {
        this.venue = venue;
    }

    public String getWebLink() {
        return webLink;
    }

    public void setWebLink(String webLink) {
        this.webLink = webLink;
    }

    public Image getImage() {
        return image;
    }

    public void setImage(Image image) {
        this.image = image;
    }

    /**
     * Details about a single artist.
     */
    public static class Artist {
        private String name;

        public Artist() {
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }

    /**
     * Details about a single venue.
     */
    public static class Venue {
        private String name;
        private Address address;
        private Location location;

        public Venue() {
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public Address getAddress() {
            return address;
        }

        public void setAddress(Address address) {
            this.address = address;
        }

        public Location getLocation() {
            return location;
        }

        public void setLocation(Location location) {
            this.location = location;
        }
    }

    /**
     * Address of a single venue.
     */
    public static class Address {
        private List<String> streetAddress;
        private String town;
        private String postcode;

        public Address() {
        }

        public List<String> getStreetAddress() {
            return streetAddress;
        }

        public void setStreetAddress(List<String> streetAddress) {
            this.streetAddress = streetAddress;
        }

        public String getTown() {
            return town;
        }

        public void setTown(String town) {
            this.town = town;
        }

        public String getPostcode() {
            return postcode;
        }

        public void setPostcode(String postcode) {
            this.postcode = postcode;
        }
    }

    /**
     * Longitude and Latitude location of a venue.
     */
    public static class Location {
        private String lat;
        private String lon;

        public Location() {
        }

        public String getLat() {
            return lat;
        }

        public void setLat(String lat) {
            this.lat = lat;
        }

        public String getLon() {
            return lon;
        }

        public void setLon(String lon) {
            this.lon = lon;
        }
    }

    /**
     * Image details
     */
    public static class Image {
        private String url;

        public Image() {
        }

        public String getUrl() {
            return url;
        }

        public void setUrl(String url) {
            this.url = url;
        }
    }


}
