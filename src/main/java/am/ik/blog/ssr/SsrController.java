package am.ik.blog.ssr;

import java.time.Instant;
import java.util.Map;
import java.util.Optional;

import am.ik.blog.entry.EntryClient;
import am.ik.blog.model.Entry;
import am.ik.pagination.CursorPage;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class SsrController {

	private final ReactRenderer reactRenderer;

	private final EntryClient entryClient;

	public SsrController(ReactRenderer reactRenderer, EntryClient entryClient) {
		this.reactRenderer = reactRenderer;
		this.entryClient = entryClient;
	}

	@GetMapping(path = { "/" })
	public String index() {
		return this.entries();
	}

	@GetMapping(path = { "/entries" })
	public String entries() {
		CursorPage<Entry, Instant> entries = this.entryClient.getEntries(Optional.empty());
		return this.reactRenderer.render("/", Map.of("preLoadedEntries", entries));
	}

	@GetMapping(path = { "/entries/{entryId}" })
	public String post(@PathVariable long entryId) {
		Entry entry = this.entryClient.getEntry(entryId)
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, entryId + " is not found."));
		return this.reactRenderer.render("/entries/%d".formatted(entryId), Map.of("preLoadedEntry", entry));
	}

}
