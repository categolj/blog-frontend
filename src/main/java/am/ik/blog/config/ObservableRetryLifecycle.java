package am.ik.blog.config;

import am.ik.spring.http.client.RetryLifecycle;
import io.micrometer.observation.Observation;
import io.micrometer.observation.Observation.Event;
import io.micrometer.observation.ObservationRegistry;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.http.HttpRequest;
import org.springframework.stereotype.Component;
import tools.jackson.databind.json.JsonMapper;

@Component
public class ObservableRetryLifecycle implements RetryLifecycle {

	private final ObservationRegistry observationRegistry;

	private final JsonMapper jsonMapper;

	ObservableRetryLifecycle(ObservationRegistry observationRegistry, JsonMapper jsonMapper) {
		this.observationRegistry = observationRegistry;
		this.jsonMapper = jsonMapper;
	}

	@Override
	public void onRetry(HttpRequest request, ResponseOrException responseOrException) {
		Observation observation = this.observationRegistry.getCurrentObservation();
		if (observation != null && responseOrException.hasException()) {
			Map<String, String> attributes = new LinkedHashMap<>();
			Exception exception = responseOrException.exception();
			attributes.put("exception.type", exception.getClass().getName());
			attributes.put("exception.message", exception.getMessage());
			Event event = Event.of("\"http.resend\":" + this.jsonMapper.writeValueAsString(attributes));
			observation.event(event);
		}
	}

}
