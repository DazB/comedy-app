package server;

import com.mashape.unirest.http.exceptions.UnirestException;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

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
        Events combinedEvents = new Events(mergeEvents(a, b));
        return combinedEvents;
    }


    private HashMap<Integer, Event> mergeEvents(List<Event>... eventLists) {
        // Our merged list of Events. Use tree map so keys sorted. Key is date so sorted keys = events in
        // chronological order. Ain't I smrt?
        TreeMap<String, List<Event>> chronologicalEventsList = new TreeMap<>();

        // Go through every events listing
        for (List<Event> events : eventLists) {
            // Go through every event stored in the listing
            for (Event event : events) {
                // We use, as a key, the date. Obvs not unique, will need to search all events on day to check for clash
                // + event.getVenue().getAddress().getPostcode().toLowerCase().replaceAll("\\s+","");
                String key = event.getDate();
                ArrayList<Event> eventList = new ArrayList<>(); // list to store events on this date
                // If we haven't already added the event, then add it
                if (!chronologicalEventsList.containsKey(key)) {
                    event.setId(chronologicalEventsList.size());   // new unique identifier set when added to merged list
                    eventList.add(event);   // Add to list of events on this day
                    chronologicalEventsList.put(key, eventList);   // add to merged list
                }
                // We've already added an event(s) at the same venue on same date. Make sure not duplicate.
                else {
                    eventList = new ArrayList<>(chronologicalEventsList.get(key)); // List of events on this day at this venue
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
                    chronologicalEventsList.put(key, eventList);
                }
            }
        }

        // Now that we have our chronological events map with the date as the key, we will now convert that to a map
        // with the event id as the key. This makes it easier for the app to distinguish between events.
        HashMap<Integer, Event> completeEventsList = new HashMap<>();
        for (Map.Entry<String, List<Event>> eventsOnDate : chronologicalEventsList.entrySet()) {
            for (Event event : eventsOnDate.getValue()) {
                completeEventsList.put(event.getId(), event);
            }
        }

        // Return our completed list of events.
        return completeEventsList;
    }


}
