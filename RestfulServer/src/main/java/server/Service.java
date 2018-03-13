/*
    Resource Representation Class for the server.
 */

package server;

public class Service {

    private final long id;
    private final String content;

    public Service(long id, String content) {
        this.id = id;
        this.content = content;
    }

    public long getId() {
        return id;
    }

    public String getContent() {
        return content;
    }
}