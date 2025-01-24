package am.ik.blog.config;

import am.ik.spring.http.client.RetryLifecycle;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.micrometer.observation.Observation;
import io.micrometer.observation.Observation.Event;
import io.micrometer.observation.ObservationRegistry;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.http.HttpRequest;
import org.springframework.stereotype.Component;

@Component
public class ObservableRetryLifecycle implements RetryLifecycle {

	private final ObservationRegistry observationRegistry;

	private final ObjectMapper objectMapper;

	ObservableRetryLifecycle(ObservationRegistry observationRegistry, ObjectMapper objectMapper) {
		this.observationRegistry = observationRegistry;
		this.objectMapper = objectMapper;
	}

	@Override
	public void onRetry(HttpRequest request, ResponseOrException responseOrException) {
		Observation observation = this.observationRegistry.getCurrentObservation();
		if (observation != null && responseOrException.hasException()) {
			Map<String, String> attributes = new LinkedHashMap<>();
			Exception exception = responseOrException.exception();
			attributes.put("exception.type", exception.getClass().getName());
			attributes.put("exception.message", exception.getMessage());
			try {
				Event event = Event.of("\"http.resend\":" + this.objectMapper.writeValueAsString(attributes));
				observation.event(event);
			}
			catch (JsonProcessingException ignored) {
			}
		}
	}

}
