/*
    Resource Representation Class for the server.
 */

package server;

import java.util.List;
import java.util.Map;

/**
 * Events class. List of many events. Structured like this:
 * {
 *     Date: {
 *         Events: {
 *             [Event],
 *             [Event]
 *         }
 *     }
 *
 * }
 */
public class Events {

    private final Map<String, List<Event>> events;

    public Events(Map<String, List<Event>> events) {
        this.events = events;
    }

    public Map<String, List<Event>> getEvents() {
        return events;
    }

}