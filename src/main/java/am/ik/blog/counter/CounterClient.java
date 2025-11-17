package am.ik.blog.counter;

import am.ik.blog.CounterApiProps;
import java.util.Objects;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class CounterClient {

	private final RestClient restClient;

	private final Logger logger = LoggerFactory.getLogger(CounterClient.class);

	public CounterClient(RestClient.Builder restClientBuilder, CounterApiProps props) {
		this.restClient = restClientBuilder.baseUrl(props.url()).build();
	}

	public Counter increment(IncrementRequest request) {
		Counter body = this.restClient.post()
			.contentType(MediaType.APPLICATION_JSON)
			.body(request)
			.retrieve()
			.body(Counter.class);
		if (body == null) {
			logger.warn("Counter increment failed, using default -1");
		}
		return Objects.requireNonNullElseGet(body, () -> new Counter(-1L));
	}

}
