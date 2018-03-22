/*
    Resource Representation Class for the server.
 */

package server;

import java.util.List;
import java.util.Map;

/**
 * Events class. Collection of many events (TODO or will be)
 */
public class Events {

    private final Map<String, List<String>> events;

    public Events( Map<String, List<String>> events) {
        this.events = events;
    }

    public Map<String, List<String>> getEvents() {
        return events;
    }

}