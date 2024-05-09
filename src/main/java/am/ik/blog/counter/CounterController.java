package am.ik.blog.counter;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CounterController {

	private final CounterClient counterClient;

	public CounterController(CounterClient counterClient) {
		this.counterClient = counterClient;
	}

	@PostMapping(path = "/api/counter")
	public Counter postCounter(@RequestBody IncrementRequest request) {
		return this.counterClient.increment(request);
	}

}
