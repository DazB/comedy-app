package server;

import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.JsonNode;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.time.ZoneOffset;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import server.responses.Ents24AuthResponse;
import server.responses.Ents24Response;
/**
 * EventsCollector class
 * Will make requests to external ticket websites
 */
public class EventsCollector {

    private Keys keys;

    private String location;

    public EventsCollector(String location) {
        this.location = location;
    }

    /**
     * Makes a request to the Ents24 API. The response is handled by RestTemplate, and the data is added to a list of
     * Events.
     *
     * @return List<Event> events. Empty if no events found or error fetching, else contains found events
     */
    public List<Event> getEnts24Events() {

        // List that stores all the events we extract from parsing JSON
        List<Event> events = new ArrayList<>();

        // Build HTTP request object, in this case the HTTP body containing our auth parameters.
        MultiValueMap<String, String> requestBody = new LinkedMultiValueMap<String, String>();
        requestBody.add("client_id", keys.entsClientId);
        requestBody.add("client_secret", keys.entsClientSecret);
        requestBody.add("username", keys.entsUsername);
        requestBody.add("password", keys.entsPassword);

        // RestTemplate will use Jackson JSON (via a message converter) to convert the data into Ents24AuthResponse object
        RestTemplate restTemplate = new RestTemplate();
        Ents24AuthResponse authResponse = restTemplate.postForObject("https://api.ents24.com/auth/login", requestBody, Ents24AuthResponse.class);

        // Now we have the access token, we can make a request for data
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", authResponse.getAccess_token());

        HttpEntity entity = new HttpEntity(headers);

        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl("https://api.ents24.com/event/list")
                .queryParam("location", "geo:" + location) // Location query string parameter
                .queryParam("radius_distance", "10")
                .queryParam("distance_unit", "mi")
                .queryParam("genre", "comedy")
                .queryParam("date_from", java.time.LocalDate.now())
                .queryParam("date_to", "2018-10-25")
                .queryParam("results_per_page", "50")
                .queryParam("incl_artists", "1")
                .queryParam("full_description", "1");

        ResponseEntity<List<Ents24Response>> response;
        try {
            response = restTemplate.exchange(builder.toUriString(), HttpMethod.GET, entity, new ParameterizedTypeReference<List<Ents24Response>>() {
            });
        }
        catch (RestClientException e) {
            System.out.println("RestClientException: "+ e);
            return events; // return an empty collection of events
        }

        // This will contain a list of Ents24Response objects containing data extracted by RestTemplate
        List<Ents24Response> responseBody = response.getBody();

        // Build an Event object to add to the list of Events, and start filling that bad boy up with data we've received
        for (int i = 0; i < responseBody.size(); i++) {
            // Headline
            String headline = responseBody.get(i).getHeadline();
            // Artist Lineup (can be null)
            List<String> lineup = new ArrayList<>();
            if (responseBody.get(i).getArtists() != null) {
                responseBody.get(i).getArtists().forEach(artist -> lineup.add(artist.getName()));
            }
            // Start date
            String date =  responseBody.get(i).getStartDate();
            // Venue details
            Event.Venue venue = new Event.Venue(
                    responseBody.get(i).getVenue().getName(),
                    new Event.Address(responseBody.get(i).getVenue().getAddress().getStreetAddress().get(0), // TODO just gets first line off address?
                            responseBody.get(i).getVenue().getAddress().getPostcode(),
                            responseBody.get(i).getVenue().getAddress().getTown()),
                    new Event.Location(responseBody.get(i).getVenue().getLocation().getLat(),
                            responseBody.get(i).getVenue().getLocation().getLon())
            );
            // Ticket url
            String ticketUrl = responseBody.get(i).getWebLink();
            // Image url (can be null)
            String imageUrl = null;
            if (responseBody.get(i).getImage() != null)
                imageUrl = responseBody.get(i).getImage().getUrl();

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
                    .queryString("apikey", keys.ticketmasterApikey)
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
