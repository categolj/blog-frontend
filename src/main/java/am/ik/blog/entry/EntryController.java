package am.ik.blog.entry;

import java.time.Duration;
import java.time.Instant;
import java.util.Optional;
import java.util.Set;
import java.util.function.Consumer;

import am.ik.blog.model.Entry;
import am.ik.pagination.CursorPage;

import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class EntryController {

	private final EntryClient entryClient;

	private static final CacheControl swrCacheControl = CacheControl.maxAge(Duration.ofHours(1))
		.staleWhileRevalidate(Duration.ofMinutes(10));

	public EntryController(EntryClient entryClient) {
		this.entryClient = entryClient;
	}

	@GetMapping(path = "/api/entries")
	public ResponseEntity<CursorPage<Entry, Instant>> getEntries(@RequestParam Optional<Instant> cursor) {
		ResponseEntity<CursorPage<Entry, Instant>> response = this.entryClient.getEntries(cursor);
		return ResponseEntity.status(response.getStatusCode())
			.headers(copyHeaders(response.getHeaders()))
			.headers(headers -> {
				CursorPage<Entry, Instant> page = response.getBody();
				if (page != null && page.size() > 0) {
					headers.setLastModified(page.content().get(0).toCursor());
				}
			})
			.cacheControl(swrCacheControl)
			.body(response.getBody());
	}

	@GetMapping(path = "/api/entries/{entryId}")
	public ResponseEntity<Entry> getEntry(@PathVariable Long entryId,
			@RequestHeader(name = HttpHeaders.IF_MODIFIED_SINCE) Optional<String> ifModifiedSince) {
		if (ifModifiedSince.isPresent()) {
			ResponseEntity<Void> head = this.entryClient.headEntry(entryId, ifModifiedSince.get());
			if (head.getStatusCode() == HttpStatus.NOT_MODIFIED) {
				return ResponseEntity.status(HttpStatus.NOT_MODIFIED).headers(copyHeaders(head.getHeaders())).build();
			}
		}
		ResponseEntity<Entry> response = this.entryClient.getEntry(entryId);
		return ResponseEntity.status(response.getStatusCode())
			.headers(copyHeaders(response.getHeaders()))
			.cacheControl(swrCacheControl)
			.body(response.getBody());
	}

	private static final Set<String> skipCopyHeaders = Set.of("server", "vary", "cache-control", "expires", "date",
			"pragma");

	private static Consumer<HttpHeaders> copyHeaders(HttpHeaders source) {
		return destination -> source.forEach((name, values) -> {
			if (skipCopyHeaders.contains(name) || name.startsWith("x-")) {
				return;
			}
			destination.put(name, values);
		});
	}

}
