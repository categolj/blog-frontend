package am.ik.blog.counter;

import java.util.Locale;

import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CounterController {

	private final CounterClient counterClient;

	public CounterController(CounterClient counterClient) {
		this.counterClient = counterClient;
	}

	@PostMapping(path = "/api/counter")
	public Counter postCounter(@RequestBody IncrementRequest request,
			@RequestHeader(name = HttpHeaders.USER_AGENT) String userAgent) {
		if (userAgent.toLowerCase(Locale.ROOT).contains("bot")) {
			return new Counter(0);
		}
		return this.counterClient.increment(request);
	}

}
