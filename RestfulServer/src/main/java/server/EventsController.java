package server;

import com.mashape.unirest.http.exceptions.UnirestException;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


/**
 * RESTful web service controller EventsController simply populates and returns an Events object.
 * The object data will be written directly to the HTTP response as JSON.
 * Basically methods in EventsController handle HTTP requests
 */
@RestController
public class EventsController {

    /**
     * Handles request. So far all of them.
     * To test, run application and open browser to localhost:8080, and you'll get yourself a nice JSON response
     * @return Events object (this will be written directly into JSON and sent as a response to HTTP requests)
     * @throws UnirestException Throws exception on bad request to ticket website (I think...)
     */
    @RequestMapping
    public Events sendEvents() throws UnirestException {

        EventsCollector collector = new EventsCollector();

        return new Events(collector.getEnts24Events());
    }
}
