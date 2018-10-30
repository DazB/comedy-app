/*
    Resource Representation Class for the server.
 */

package server;

import java.util.HashMap;
import java.util.List;

/**
 * Events class. List of many events
 */
public class Events {

    private final HashMap<String, Event> events;

    public Events(HashMap<String, Event> events) {
        this.events = events;
    }

    public HashMap<String, Event> getEvents() {
        return events;
    }

}