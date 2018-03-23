/*
    Resource Representation Class for the server.
 */

package server;

import java.util.List;

/**
 * Events class. List of many events
 */
public class Events {

    private final List<Event> events;

    public Events(List<Event> events) {
        this.events = events;
    }

    public List<Event> getEvents() {
        return events;
    }

}