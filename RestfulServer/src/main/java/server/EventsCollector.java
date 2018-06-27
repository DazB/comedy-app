package server;

import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.JsonNode;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import ch.hsr.geohash.GeoHash;

import java.time.ZoneOffset;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * EventsCollector class
 * Will make requests to external ticket websites
 */
public class EventsCollector {

    private String location;

    public EventsCollector(String location) {
        this.location = location;
    }

    /**
     * Makes a request to Ents24 API, gets comedy events JSON, parses it, and returns the events
     * @return List<Event> events. Empty if no events found or error fetching, else contains found events
     * @throws UnirestException Exception for bad request to website
     * @throws JSONException JSON parsing error (I blame whatever monkey documents these API's)
     */
    public List<Event> getEnts24Events() throws UnirestException, JSONException {
        /* Ent24 Api keys and id */
        String client_id = "91fdea0e6e8de74094ad0495f34ba081903e8bea";
        String client_secret = "bfd40f1dcb565e9a0e206395c7ae7c6f108cd26a";
        String username = "dazbahri@hotmail.co.uk";
        String password = "ShitPissFuckCunt";

        // List that stores all the events we extract from parsing JSON
        List<Event> events = new ArrayList<>();

        HttpResponse<JsonNode> jsonResponse;
        try {
            // Build HTTP auth request to get auth token to make events requests
            HttpResponse<JsonNode> authResponse = Unirest.post("https://api.ents24.com/auth/login")
                    .field("client_id", client_id)
                    .field("client_secret", client_secret)
                    .field("username", username)
                    .field("password", password)
                    .asJson();

            // Get auth token
            String auth = authResponse.getBody().getObject().get("access_token").toString();

            // Build HTTP events request
            jsonResponse = Unirest.get("https://api.ents24.com/event/list")
                    .header("Authorization", auth)
                    .queryString("location", "geo:" + location) // Location query string parameter
                    .queryString("radius_distance", "10")
                    .queryString("distance_unit", "mi")
                    .queryString("genre", "comedy")
                    .queryString("date_from", java.time.LocalDate.now())
                    .queryString("date_to", "2018-07-25")
                    .queryString("results_per_page", "50")
                    .queryString("incl_artists", "1")
                    .queryString("full_description", "1")
                    .asJson();
        }
        // Exception handler. Return empty events collection
        catch (Exception e) {
            System.out.println("Exception occurred. Most likely bad request");
            return events;
        }

        // Return empty events collection if there are no events
        if (jsonResponse.getStatusText().equals("No Content")) {
            return events;
        }

        // Our response from events request
        JSONArray eventsJsonArray = jsonResponse.getBody().getArray();

        // Parse the events request json we got, extracting data we want
        for (int i = 0; i < eventsJsonArray.length(); i++) {
            // Get this events JSON
            JSONObject comedyEvent = eventsJsonArray.getJSONObject(i);

            // Get headline
            String headline = comedyEvent.getString("headline");

            // Check if lineup exists, then extract lineup from JSON
            List<String> lineup = new ArrayList<>();
            if (comedyEvent.has("artists")) {
                JSONArray artistsJSONArray = comedyEvent.getJSONArray("artists");
                for (int j = 0; j < artistsJSONArray.length(); j++) {
                    JSONObject artistJSON = artistsJSONArray.getJSONObject(j);
                    lineup.add(artistJSON.getString("name"));
                }
            }

            // Get start date
            String date = comedyEvent.getString("startDate");

            // Get venue details and save to Venue object
            JSONObject venueJSON = comedyEvent.getJSONObject("venue");
            Double lat = venueJSON.getJSONObject("location").getDouble("lat");
            Double lon = venueJSON.getJSONObject("location").getDouble("lon");
            Event.Location venueLocation = new Event.Location(
                    lat.toString(),
                    lon.toString()
            );
            Event.Address venueAddress = new Event.Address(
                    venueJSON.getJSONObject("address").getJSONArray("streetAddress").getString(0),
                    venueJSON.getJSONObject("address").getString("postcode"),
                    venueJSON.getJSONObject("address").getString("town")
            );
            Event.Venue venue = new Event.Venue(
                    venueJSON.getString("name"),
                    venueAddress,
                    venueLocation
            );

            // Get url to purchase tickets
            String ticketUrl = comedyEvent.getString("webLink");

            String imageUrl = "";
            // Get image url if it exists
            if (comedyEvent.has("image")) {
                JSONObject image = comedyEvent.getJSONObject("image");
                imageUrl = image.getString("url");
            }
            // Build an event object and add it to our list of events
            Event event = new Event(i, headline, lineup, date, venue, ticketUrl, imageUrl);
            events.add(event);
        }

        return events;
    }

    /**
     * Make a request to Ticketmaster API for events
     * @return List<Event> events. Empty if no events found or error fetching, else contains found events
     * @throws UnirestException Exception for bad request to website
     * @throws JSONException JSON parsing error (I blame whatever monkey documents these API's)
     */
    public List<Event> getTicketmasterEvents() throws UnirestException, JSONException {
        /* Ticketmaster Api key */
        String apikey = "xoGWGgRDOLHGsutqGIk0YLGaNXaYhsAA";

        // List that stores all the events we extract from parsing JSON
        List<Event> events = new ArrayList<>();

        // Location in geohash form (cos TicketMaster wants to be a difficult bitch) TODO include actual location
        //String locationGeoHash = GeoHash.geoHashStringWithCharacterPrecision(53.9576300,-1.0827100, 5);
        String locationGeoHash = "u10j4"; // LANDAN g8whc u10j4
        // Filter results to find only comedy
        String genreFilter = "{Comedy}";
        // Parse start and end date to get it in correct format TODO timezone shit?
        String startDate = LocalDate.now().atStartOfDay().toInstant(ZoneOffset.UTC).toString();
        String endDate = LocalDate.parse("2018-07-25").atStartOfDay().toInstant(ZoneOffset.UTC).toString();

        HttpResponse<JsonNode> request;
        // Build HTTP auth request to get auth token to make events requests
        try {
            request = Unirest.get("https://app.ticketmaster.com/discovery/v2/events")
                    .queryString("apikey", apikey)
                    .queryString("geoPoint", locationGeoHash)
                    .queryString("radius", "10")
                    .queryString("unit", "miles")
                    .queryString("classificationName", genreFilter)
                    .queryString("startDateTime", startDate)
                    .queryString("endDateTime", endDate)
                    .queryString("size", "199")
                    .asJson();
        }
        catch (Exception e) {
            System.out.println("Exception occurred. Most likely bad request");
            return events; // return an empty collection of events
        }

        // Check for null event response
        if (!request.getBody().getObject().has("_embedded")) {
            return events; // return an empty collection of events
        }

        // Check if any events were found
        if (!request.getBody().getObject().getJSONObject("_embedded").has("events")) {
            return events;    // return an empty collection of events
        }

        // Get events list from JSON response
        JSONArray eventsJsonArray = request.getBody().getObject().getJSONObject("_embedded").optJSONArray("events");

        // Parse the events request json we got, extracting data we want
        for (int i = 0; i < eventsJsonArray.length(); i++) {
            // Get JSON for this event
            JSONObject comedyEvent = eventsJsonArray.getJSONObject(i);

            // Get headline
            String headline = comedyEvent.getString("name");

            // Get artists (can be null)
            List<String> lineup = new ArrayList<>();
            // Check if list of artists. If so, save a list of the lineup
            if (comedyEvent.getJSONObject("_embedded").has("attractions")) {
                JSONArray artistsJSONArray = comedyEvent.getJSONObject("_embedded").getJSONArray("attractions");
                for (int j = 0; j < artistsJSONArray.length(); j++) {
                    JSONObject artistJSON = artistsJSONArray.getJSONObject(j);
                    lineup.add(artistJSON.getString("name"));
                }
            }

            // Get start date
            String date = comedyEvent.getJSONObject("dates").getJSONObject("start").getString("localDate");

            // Get venue details and save to Venue object
            JSONObject venueJSON = comedyEvent.getJSONObject("_embedded").getJSONArray("venues").getJSONObject(0);
            Event.Location venueLocation = new Event.Location(
                    venueJSON.getJSONObject("location").getString("latitude"),
                    venueJSON.getJSONObject("location").getString("longitude")
            );
            Event.Address venueAddress = new Event.Address(
                    venueJSON.getJSONObject("address").getString("line1"),
                    venueJSON.getString("postalCode"),
                    venueJSON.getJSONObject("city").getString("name")
            );
            Event.Venue venue = new Event.Venue(
                    venueJSON.getString("name"),
                    venueAddress,
                    venueLocation
            );

            // Get ticket url link
            String ticketUrl = comedyEvent.getString("url");

            // Get image url (there are many returned images. Just pick the first one) TODO way to choose a better one?
            String imageUrl = comedyEvent.getJSONArray("images").getJSONObject(0).getString("url");

            // Build an event object and add it to our list of events
            Event event = new Event(i, headline, lineup, date, venue, ticketUrl, imageUrl);
            events.add(event);
        }
        return events;
    }
}
