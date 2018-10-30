package server;

import com.mashape.unirest.http.exceptions.UnirestException;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;

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
     * @return Events object. This will be written directly into JSON and sent as a response to HTTP requests
     * @throws UnirestException Throws exception on bad request to ticket website (I think...)
     */
    @RequestMapping("/events")
    public Events sendEvents(@RequestParam(value="location", defaultValue="53.9576300,-1.0827100") String location) throws UnirestException {
        // Get dem events
        EventsCollector collector = new EventsCollector(location);
        List<Event> a = collector.getEnts24Events();
        List<Event> b = collector.getTicketmasterEvents();
        Events completeList = new Events(mergeEvents(a, b));
        return completeList;
        //return new Events(collector.getTicketmasterEvents());
//        return new Events(collector.getEnts24Events());
    }


    private HashMap<String, Event> mergeEvents(List<Event>... eventLists) {
        // Our merged list of Events
        HashMap<String, Event> mergedEventsList = new HashMap<String, Event>();

        // Go through every events listing
        for (List<Event> events : eventLists) {
            // Go through every event stored in the listing
            for (Event event : events) {
                // We use, as a key, the date, the venue name and the venue postcode (this is hopefully unique to each event)
                String key = event.getDate() + event.getVenue().getName() + event.getVenue().getAddress().getPostcode();
                // If we haven't already added the event, then add it
                if (!mergedEventsList.containsKey(key)) {
                    mergedEventsList.put(key, event);
                }
                // Ah, we've already added an event with the same venue and day.
                else {
                    // Go through, compare each property, if one is missing or "better", replace it
                    Event savedEvent = mergedEventsList.get(key);
                    if (savedEvent.getTitle().equals("") && !event.getTitle().equals("")) {
                        savedEvent.setTitle(event.getTitle());
                    }
                    if (savedEvent.getHeadline().equals("") && !event.getHeadline().equals("")) {
                        savedEvent.setTitle(event.getHeadline());
                    }
                    // If the new event has a larger size for the lineup, use the new one
                    if (savedEvent.getLineup().size() < event.getLineup().size()) {
                        savedEvent.setLineup(event.getLineup());
                    }
                    if (savedEvent.getTime().equals("") && !event.getTime().equals("")) {
                        savedEvent.setTime(event.getTime());
                    }
                    // Add the new ticket url to the list of ticket url's
                    savedEvent.getTicketUrl().addAll(event.getTicketUrl());

                }

            }

        }

        // Return our completed list of events.
        return mergedEventsList;
    }


}
