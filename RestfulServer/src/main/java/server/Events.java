/*
    Resource Representation Class for the server.
 */

package server;

import java.util.List;
import java.util.Map;

/**
 * Events class. List of many events. Structured like this:
 * {
 *     "Event ID": {
 *         Event
 *     },
 *     .....
 * }
 */
public class Events {

    private final Map<Integer, Event> events;

    public Events(Map<Integer, Event> events) {
        this.events = events;
    }

    public Map<Integer, Event> getEvents() {
        return events;
    }

}