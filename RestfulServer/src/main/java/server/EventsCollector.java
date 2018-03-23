package server;

import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.JsonNode;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;
import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

/**
 * EventsCollector class
 * Will make requests to external ticket websites
 */
public class EventsCollector {

    /* Ent24 Api keys and id */
    private final String client_id = "91fdea0e6e8de74094ad0495f34ba081903e8bea";
    private final String client_secret = "bfd40f1dcb565e9a0e206395c7ae7c6f108cd26a";
    private final String username = "dazbahri@hotmail.co.uk";
    private final String password = "ShitPissFuckCunt";

    /**
     * Makes a request to Ents24 API, gets comedy events JSON, parses it, and returns the events
     * @throws UnirestException Exception for bad request to website
     */
    public List<Event> getEnts24Events() throws UnirestException {

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
                .queryString("location", "geo:53.9576300,-1.0827100")
                .queryString("radius_distance", "10")
                .queryString("distance_unit", "mi")
                .queryString("genre", "comedy")
                .queryString("date_from", "2018-03-30")
                .queryString("date_to", "2018-06-25")
                .queryString("results_per_page", "50")
                .queryString("incl_artists", "1")
                .queryString("full_description", "1")
                .asJson();

        // Our response from events request
        JSONArray jsonArray = jsonResponse.getBody().getArray();

        // List that stores all the events we extract from parsing JSON
        List<Event> events = new ArrayList<>();

        /* Parse the events request json we got, extracting data we want
        * TODO this can be done with ObjectMapper, but dunno how to extract specific shit */
        for (int i = 0; i < jsonArray.length(); i++) {
            JSONObject comedyEvent = jsonArray.getJSONObject(i);
            String title = comedyEvent.getString("title");

            // Check if lineup exists, then extract lineup from JSON
            List<String> lineup = new ArrayList<>();
            if (comedyEvent.has("artists")) {
                JSONArray artists = comedyEvent.getJSONArray("artists");
                for (int j = 0; j < artists.length(); j++) {
                    JSONObject artistJSON = artists.getJSONObject(j);
                    lineup.add(artistJSON.getString("name"));
                }
            }

            String startDate = comedyEvent.getString("startDate");

            // Extract venue name TODO will be its own object
            JSONObject venueJSON = comedyEvent.getJSONObject("venue");
            String venue = venueJSON.getString("name");

            String ticketUrl = comedyEvent.getString("webLink");

            String imageUrl = "";
            // Extract image url if it exists
            if (comedyEvent.has("image")) {
                JSONObject image = comedyEvent.getJSONObject("image");
                imageUrl = image.getString("url");
            }
            // Build an event object and add it to our list of events
            Event event = new Event(title, lineup, startDate, venue, ticketUrl, imageUrl);
            events.add(event);
        }

        return events;
    }
}
