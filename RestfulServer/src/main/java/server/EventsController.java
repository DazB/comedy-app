/*
    Controller handles HTTP requests
 */

package server;

import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.JsonNode;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

/*
 * RestController annotation marks the class as a controller where every method returns a domain object
 * instead of a view
 */
@RestController
public class EventsController {

    private final String client_id = "91fdea0e6e8de74094ad0495f34ba081903e8bea";
    private final String client_secret = "bfd40f1dcb565e9a0e206395c7ae7c6f108cd26a";
    private final String username = "dazbahri@hotmail.co.uk";
    private final String password = "ShitPissFuckCunt";

    /*
     * RESTful web service controller simply populates and returns a Event object.
     * The object data will be written directly to the HTTP response as JSON.
     */
    @RequestMapping
    public Events sendEvents() throws UnirestException {

        HttpResponse<JsonNode> authResponse = Unirest.post("https://api.ents24.com/auth/login")
                .field("client_id", client_id)
                .field("client_secret", client_secret)
                .field("username", username)
                .field("password", password)
                .asJson();

        String auth = authResponse.getBody().getObject().get("access_token").toString();

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

        Map<String, List<String>> comedyEvents = new LinkedHashMap<String, List<String>>();

        JSONArray jsonArray = jsonResponse.getBody().getArray();

        for (int i = 0; i < jsonArray.length(); i++) {
            JSONObject comedyEvent = jsonArray.getJSONObject(i);
            String startDate = comedyEvent.getString("startDate");
            String headline = comedyEvent.getString("headline");
            if (comedyEvents.containsKey(startDate)) {
                comedyEvents.get(startDate).add(headline);
            }
            else {
                comedyEvents.put(startDate, new ArrayList<String>());
                comedyEvents.get(startDate).add(headline);
            }
        }

        Events response = new Events(comedyEvents);
        return response;
    }
}
