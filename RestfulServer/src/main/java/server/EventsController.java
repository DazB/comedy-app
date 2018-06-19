package server;

import com.mashape.unirest.http.exceptions.UnirestException;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * RESTful web service controller EventsController simply populates and returns an Events object.
 * The object data will be written directly to the HTTP response as JSON.
 * Basically methods in EventsController handle HTTP requests
 */
@RestController
public class EventsController {

    /**
     * Handles events requests.
     * @param location The geolocation query string. Defaults to York <3
     * @return Events object (this will be written directly into JSON and sent as a response to HTTP requests)
     * @throws UnirestException Throws exception on bad request to ticket website (I think...)
     */
    @RequestMapping("/events")
    public Events sendEvents(@RequestParam(value="location", defaultValue="geo:53.9576300,-1.0827100") String location) throws UnirestException {
        // Get dem events
        EventsCollector collector = new EventsCollector(location);
        collector.getTicketmasterEvents();

        return new Events(collector.getEnts24Events());
    }
}
