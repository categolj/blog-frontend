package am.ik.blog.info;

import java.util.List;
import java.util.Map;

import am.ik.blog.entry.api.InfoApi;

import org.springframework.boot.actuate.info.InfoEndpoint;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class InfoController {

	private final InfoEndpoint infoEndpoint;

	private final am.ik.blog.entry.api.InfoApi entryInfoApi;

	private final am.ik.note.api.InfoApi noteInfoApi;

	public InfoController(InfoEndpoint infoEndpoint, InfoApi entryInfoApi, am.ik.note.api.InfoApi noteInfoApi) {
		this.infoEndpoint = infoEndpoint;
		this.entryInfoApi = entryInfoApi;
		this.noteInfoApi = noteInfoApi;
	}

	@GetMapping(path = "/api/info")
	public List<Map<String, Object>> info() {
		Map<String, Object> self = this.infoEndpoint.info();
		Map<String, Object> entry = this.entryInfoApi.info();
		Map<String, Object> note = this.noteInfoApi.info();
		return List.of(Map.of("name", "Self", "info", self), Map.of("name", "Entry API", "info", entry),
				Map.of("name", "Note API", "info", note));
	}

}
