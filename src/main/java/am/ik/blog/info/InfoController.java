package am.ik.blog.info;

import am.ik.blog.BlogApiProps;
import am.ik.blog.CounterApiProps;
import am.ik.blog.ImageProxyProps;
import am.ik.blog.NoteApiProps;
import am.ik.blog.TranslationApiProps;
import java.util.List;
import java.util.Map;
import java.util.Objects;
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

	@GetMapping(path = "/api/info")
	public List<Map<String, Object>> info() {
		Map<String, Object> self = this.infoEndpoint.info();
		Map<String, Object> entry = this.restClient.get()
			.uri(this.blogApiProps.url() + "/actuator/info")
			.retrieve()
			.body(new ParameterizedTypeReference<>() {
			});
		Map<String, Object> translation = this.restClient.get()
			.uri(this.translationApiProps.url() + "/actuator/info")
			.retrieve()
			.body(new ParameterizedTypeReference<>() {
			});
		Map<String, Object> note = this.restClient.get()
			.uri(this.noteApiProps.url() + "/actuator/info")
			.retrieve()
			.body(new ParameterizedTypeReference<>() {
			});
		Map<String, Object> counter = this.restClient.get()
			.uri(UriComponentsBuilder.fromUriString(this.counterApiProps.url())
				.replacePath("/actuator/info")
				.build()
				.toUri())
			.retrieve()
			.body(new ParameterizedTypeReference<>() {
			});
		Map<String, Object> imageProxy = this.restClient.get()
			.uri(this.imageProxyProps.url() + "/actuator/info")
			.retrieve()
			.body(new ParameterizedTypeReference<>() {
			});
		return List.of(Map.of("name", "Self", "info", self), Map.of("name", "Entry API", "info", entry),
				Map.of("name", "Translation API", "info", Objects.requireNonNull(translation)),
				Map.of("name", "Note API", "info", note), Map.of("name", "Counter API", "info", counter),
				Map.of("name", "Image Proxy", "info", Objects.requireNonNull(imageProxy)));
	}

}
