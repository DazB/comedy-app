package server;

import com.mashape.unirest.http.exceptions.UnirestException;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.TreeMap;
import org.apache.commons.text.similarity.JaroWinklerDistance;

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


    private TreeMap<String, List<Event>> mergeEvents(List<Event>... eventLists) {
        // Our merged list of Events. Use tree map so keys sorted (first part of key is date so sorted keys = events in
        // chronological order. Ain't I smrt?
        TreeMap<String, List<Event>> mergedEventsList = new TreeMap<>();

        // Go through every events listing
        for (List<Event> events : eventLists) {
            // Go through every event stored in the listing
            for (Event event : events) {
                // We use, as a key, the date, the venue postcode (formatted). This may not be unique so we have to do additional checks if matched
                String key = event.getDate() + event.getVenue().getAddress().getPostcode().toLowerCase().replaceAll("\\s+","");
                ArrayList<Event> eventList = new ArrayList<>(); // list to store events on this date
                // If we haven't already added the event, then add it
                if (!mergedEventsList.containsKey(key)) {
                    event.setId(mergedEventsList.size());   // new unique identifier set when added to merged list
                    eventList.add(event);   // Add to list of events on this day
                    mergedEventsList.put(key, eventList);   // add to merged list
                }
                // We've already added an event(s) at the same venue on same date. Make sure not duplicate.
                else {
                    eventList = new ArrayList<>(mergedEventsList.get(key)); // List of events on this day at this venue
                    JaroWinklerDistance compare = new JaroWinklerDistance(); // Our fancy ass string comparator
                    boolean sameEvent = false; // flag to store whether we found the same event
                    int index = 0; // Gotta provide own counter cos iterators reasons blah blah blah
                    // Go through every event on this date in this venue
                    for (Event savedEvent : eventList) {
                        // Using some fancy ass string comparator, we check if the 2 event's headlines or titles
                        // are similar. If they are similar enough (above 0.8 match) it's the same event.
                        // Merge them.
                        // (FYI this wouldn't be a problem if people could fuckin spell names or maintain some consistency)
                        if ((compare.apply(event.getHeadline().toLowerCase(), savedEvent.getHeadline().toLowerCase()) > 0.8) ||
                                compare.apply(event.getTitle().toLowerCase(), savedEvent.getTitle().toLowerCase()) > 0.8) {
                            sameEvent = true; // We found the same event
                            // Go through, compare each property, if one is missing or "better", replace it
                            if ((savedEvent.getTitle().equals("") && !event.getTitle().equals("")) ||
                                    (savedEvent.getTitle().length() < event.getTitle().length())) {
                                savedEvent.setTitle(event.getTitle());
                            }
                            if ((savedEvent.getHeadline().equals("") && !event.getHeadline().equals("")) ||
                                    (savedEvent.getHeadline().length() < event.getHeadline().length())) {
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
                            eventList.set(index, savedEvent);
                            break; // Exit loop
                        }
                        index++;
                    }
                    // Else it's a different event, but on the same date in the same venue. Add it to the list.
                    if (!sameEvent) {
                        eventList.add(event);
                    }
                    // Put the event list back into the merged list with the new event added for this date and venue
                    mergedEventsList.put(key, eventList);


                }
            }
        }
        // Return our completed list of events.
        return mergedEventsList;
    }


}
