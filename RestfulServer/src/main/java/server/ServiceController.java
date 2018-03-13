/*
    Controller handles HTTP requests
 */

package server;

import java.util.concurrent.atomic.AtomicLong;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/*
 * RestController annotation marks the class as a controller where every method returns a domain object
 * instead of a view
 */
@RestController
public class ServiceController {

    private static final String template = "Hello, %s!";
    private final AtomicLong counter = new AtomicLong();

    /*
     * RESTful web service controller simply populates and returns a Service object.
     * The object data will be written directly to the HTTP response as JSON.
     */
    @RequestMapping("/greeting")
    public Service greeting(@RequestParam(value="name", defaultValue="World") String name) {
        return new Service(counter.incrementAndGet(),
                String.format(template, name));
    }
}
