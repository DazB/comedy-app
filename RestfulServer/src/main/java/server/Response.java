/*
    Resource Representation Class for the server.
 */

package server;

import java.util.ArrayList;

public class Response {

    private String date;
    private ArrayList headlines;

    public Response(String date, ArrayList headlines) {
        this.date = date;
        this.headlines = headlines;
    }

    public String getDate() {
        return date;
    }

    public ArrayList getHeadlines() {
        return headlines;
    }
}