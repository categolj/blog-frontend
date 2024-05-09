package am.ik.blog.counter;

import am.ik.blog.CounterApiProps;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class CounterClient {

	private final RestClient restClient;

	public CounterClient(RestClient.Builder restClientBuilder, CounterApiProps props) {
		this.restClient = restClientBuilder.baseUrl(props.url()).build();
	}

	public Counter increment(IncrementRequest request) {
		return this.restClient.post()
			.contentType(MediaType.APPLICATION_JSON)
			.body(request)
			.retrieve()
			.body(Counter.class);
	}

}
