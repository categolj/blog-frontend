package am.ik.blog.info;

import java.util.List;
import java.util.Map;
import java.util.Objects;

import am.ik.blog.ImageProxyProps;
import am.ik.blog.entry.api.InfoApi;

import org.springframework.boot.actuate.info.InfoEndpoint;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClient;

@RestController
public class InfoController {

	private final InfoEndpoint infoEndpoint;

	private final am.ik.blog.entry.api.InfoApi entryInfoApi;

	private final am.ik.note.api.InfoApi noteInfoApi;

	private final RestClient restClient;

	private final ImageProxyProps imageProxyProps;

	public InfoController(InfoEndpoint infoEndpoint, InfoApi entryInfoApi, am.ik.note.api.InfoApi noteInfoApi,
			RestClient.Builder restClientBuilder, ImageProxyProps imageProxyProps) {
		this.infoEndpoint = infoEndpoint;
		this.entryInfoApi = entryInfoApi;
		this.noteInfoApi = noteInfoApi;
		this.restClient = restClientBuilder.build();
		this.imageProxyProps = imageProxyProps;
	}

	@GetMapping(path = "/api/info")
	public List<Map<String, Object>> info() {
		Map<String, Object> self = this.infoEndpoint.info();
		Map<String, Object> entry = this.entryInfoApi.info();
		Map<String, Object> note = this.noteInfoApi.info();
		Map<String, Object> imageProxy = this.restClient.get()
			.uri(this.imageProxyProps.url() + "/info")
			.retrieve()
			.body(new ParameterizedTypeReference<>() {
			});
		return List.of(Map.of("name", "Self", "info", self), Map.of("name", "Entry API", "info", entry),
				Map.of("name", "Note API", "info", note),
				Map.of("name", "Image Proxy", "info", Objects.requireNonNull(imageProxy)));
	}

}
