package am.ik.blog.info;

import am.ik.blog.BlogApiProps;
import am.ik.blog.CounterApiProps;
import am.ik.blog.ImageProxyProps;
import am.ik.blog.NoteApiProps;
import am.ik.blog.TranslationApiProps;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.StructuredTaskScope;
import java.util.concurrent.StructuredTaskScope.Subtask;
import org.springframework.boot.actuate.info.InfoEndpoint;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

@RestController
public class InfoController {

	private final BlogApiProps blogApiProps;

	private final InfoEndpoint infoEndpoint;

	private final RestClient restClient;

	private final NoteApiProps noteApiProps;

	private final TranslationApiProps translationApiProps;

	private final CounterApiProps counterApiProps;

	private final ImageProxyProps imageProxyProps;

	public InfoController(BlogApiProps blogApiProps, InfoEndpoint infoEndpoint, RestClient.Builder restClientBuilder,
			NoteApiProps noteApiProps, TranslationApiProps translationApiProps, CounterApiProps counterApiProps,
			ImageProxyProps imageProxyProps) {
		this.blogApiProps = blogApiProps;
		this.infoEndpoint = infoEndpoint;
		this.restClient = restClientBuilder.defaultStatusHandler(__ -> true, (req, res) -> {
		}).build();
		this.noteApiProps = noteApiProps;
		this.translationApiProps = translationApiProps;
		this.counterApiProps = counterApiProps;
		this.imageProxyProps = imageProxyProps;
	}

	@SuppressWarnings("preview")
	@GetMapping(path = "/api/info")
	public List<Map<String, Object>> info() throws InterruptedException {
		try (var scope = StructuredTaskScope.open()) {
			Subtask<Map<String, Object>> self = scope.fork(this.infoEndpoint::info);
			Subtask<Map<String, Object>> entry = scope.fork(() -> Objects.requireNonNullElseGet(this.restClient.get()
				.uri(this.blogApiProps.url() + "/actuator/info")
				.retrieve()
				.body(new ParameterizedTypeReference<>() {
				}), Map::of));
			Subtask<Map<String, Object>> translation = scope
				.fork(() -> Objects.requireNonNullElseGet(this.restClient.get()
					.uri(this.translationApiProps.url() + "/actuator/info")
					.retrieve()
					.body(new ParameterizedTypeReference<>() {
					}), Map::of));
			Subtask<Map<String, Object>> note = scope.fork(() -> Objects.requireNonNullElseGet(this.restClient.get()
				.uri(this.noteApiProps.url() + "/actuator/info")
				.retrieve()
				.body(new ParameterizedTypeReference<>() {
				}), Map::of));
			Subtask<Map<String, Object>> counter = scope.fork(() -> Objects.requireNonNullElseGet(this.restClient.get()
				.uri(UriComponentsBuilder.fromUriString(this.counterApiProps.url())
					.replacePath("/actuator/info")
					.build()
					.toUri())
				.retrieve()
				.body(new ParameterizedTypeReference<>() {
				}), Map::of));
			Subtask<Map<String, Object>> imageProxy = scope
				.fork(() -> Objects.requireNonNullElseGet(this.restClient.get()
					.uri(this.imageProxyProps.url() + "/actuator/info")
					.retrieve()
					.body(new ParameterizedTypeReference<>() {
					}), Map::of));
			scope.join();
			return List.of( //
					Map.of("name", "Self", "info", self.get()), //
					Map.of("name", "Entry API", "info", entry.get()), //
					Map.of("name", "Translation API", "info", translation.get()), //
					Map.of("name", "Note API", "info", note.get()), //
					Map.of("name", "Counter API", "info", counter.get()), //
					Map.of("name", "Image Proxy", "info", imageProxy.get()) //
			);
		}
	}

}
