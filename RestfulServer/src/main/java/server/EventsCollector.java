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
     *
     * @throws UnirestException Exception for bad request to website
     */
    public List<Event> getEnts24Events() throws UnirestException {
        /* Ent24 Api keys and id */
        String client_id = "91fdea0e6e8de74094ad0495f34ba081903e8bea";
        String client_secret = "bfd40f1dcb565e9a0e206395c7ae7c6f108cd26a";
        String username = "dazbahri@hotmail.co.uk";
        String password = "ShitPissFuckCunt";

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
        HttpResponse<JsonNode> jsonResponse = Unirest.get("https://api.ents24.com/event/list")
                .header("Authorization", auth)
                .queryString("location", "geo:" + location) // Location query string parameter
                .queryString("radius_distance", "10")
                .queryString("distance_unit", "mi")
                .queryString("genre", "comedy")
                .queryString("date_from", java.time.LocalDate.now())
                .queryString("date_to", "2018-06-25")
                .queryString("results_per_page", "50")
                .queryString("incl_artists", "1")
                .queryString("full_description", "1")
                .asJson();

        // Our response from events request
        JSONArray eventsJsonArray = jsonResponse.getBody().getArray();

        // List that stores all the events we extract from parsing JSON
        List<Event> events = new ArrayList<>();

        /* Parse the events request json we got, extracting data we want
         * TODO this can be done with ObjectMapper, but dunno how to extract specific shit */
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

            // Extract venue name TODO will be its own object
            JSONObject venueJSON = comedyEvent.getJSONObject("venue");
            String venue = venueJSON.getString("name");

            // Get url to purchase tickets
            String ticketUrl = comedyEvent.getString("webLink");

            String imageUrl = "";
            // Extract image url if it exists
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
     * Makes a request to Ticketmaster API
     *
     * @throws UnirestException Exception for bad request to website
     * @throws JSONException JSON parsing error (I blame whatever monkey documents these API's)
     */
    public void getTicketmasterEvents() throws UnirestException, JSONException {
        /* Ticketmaster Api key */
        String apikey = "xoGWGgRDOLHGsutqGIk0YLGaNXaYhsAA";

        // Location in geohash form (cos TicketMaster wants to be a difficult bitch) TODO include actual location
        //String locationGeoHash = GeoHash.geoHashStringWithCharacterPrecision(53.9576300,-1.0827100, 5);
        String locationGeoHash = "u10j4"; // LANDAN
        // Filter results to find only comedy
        String genreFilter = "{Comedy}";
        // Parse start and end date to get it in correct format TODO timezone shit?
        String startDate = LocalDate.now().atStartOfDay().toInstant(ZoneOffset.UTC).toString();
        String endDate = LocalDate.parse("2018-06-25").atStartOfDay().toInstant(ZoneOffset.UTC).toString();

        // Build HTTP auth request to get auth token to make events requests
        HttpResponse<JsonNode> request = Unirest.get("https://app.ticketmaster.com/discovery/v2/events")
                .queryString("apikey", apikey)
                .queryString("geoPoint", locationGeoHash)
                .queryString("radius", "10")
                .queryString("unit", "miles")
                .queryString("classificationName", genreFilter)
                .queryString("startDateTime", startDate)
                .queryString("endDateTime", endDate)
                .queryString("size", "50")
                .asJson();

        // List that (stores all the events we extract from parsing JSON
        List<Event> events = new ArrayList<>();

        // Get events list from JSON response to our request
        JSONArray eventsJsonArray = request.getBody().getObject().optJSONObject("_embedded").optJSONArray("events");

        // No events were found
        if (eventsJsonArray == null) {
            return;
            //return events;    // return an empty collection of events
        }

        // Parse the events request json we got, extracting data we want
        for (int i = 0; i < eventsJsonArray.length(); i++) {
            // Get JSON for this event
            JSONObject comedyEvent = eventsJsonArray.getJSONObject(i);

            // Get headline
            String headline = comedyEvent.getString("name");

            // Get artists
            List<String> lineup = new ArrayList<>();
            JSONArray artistsJSONArray = comedyEvent.optJSONObject("_embedded").optJSONArray("attractions");
            if (artistsJSONArray != null) {
                for (int j = 0; j < artistsJSONArray.length(); j++) {
                    JSONObject artistJSON = artistsJSONArray.getJSONObject(j);
                    lineup.add(artistJSON.getString("name"));
                }
            }


            // TODO null pointer exceptions? assert? some of this shit isnt in every response......
            // like .has("hfdsfh") ? .getString("fdhf") : "";
            // Get start date
            String date = comedyEvent.getJSONObject("dates").getJSONObject("start").getString("localDate");

            // Extract venue name TODO will be its own object
            String venue = comedyEvent.getJSONObject("_embedded").getJSONArray("venues").getJSONObject(0).getString("name");

            // Get ticket url link
            String ticketUrl = comedyEvent.getString("url");

            // Get image url
            String imageUrl = comedyEvent.getJSONArray("images").getJSONObject(0).getString("url");

            // Build an event object and add it to our list of events
            Event event = new Event(i, headline, lineup, date, venue, ticketUrl, imageUrl);
            events.add(event);
        }

    }
}
