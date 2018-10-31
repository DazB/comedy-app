/*
    Resource Representation Class for the server.
 */

package server;

import java.util.Map;

/**
 * Events class. List of many events
 */
public class Events {

    private final Map<String, Event> events;

    public Events(Map<String, Event> events) {
        this.events = events;
    }

    public Map<String, Event> getEvents() {
        return events;
    }

}