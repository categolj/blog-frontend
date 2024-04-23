package am.ik.blog.entry;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

import am.ik.blog.model.Category;
import am.ik.blog.model.Entry;
import am.ik.blog.model.Tag;
import am.ik.pagination.CursorPage;

import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
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
	public ResponseEntity<CursorPage<Entry, Instant>> getEntries(EntryRequest request) {
		ResponseEntity<CursorPage<Entry, Instant>> response = this.entryClient.getEntries(request);
		return ResponseEntity.ok().headers(headers -> {
			CursorPage<Entry, Instant> page = response.getBody();
			if (page != null && page.size() > 0) {
				headers.setLastModified(page.content().get(0).toCursor());
			}
		}).cacheControl(swrCacheControl).body(response.getBody());
	}

	@GetMapping(path = "/api/entries/{entryId}")
	public ResponseEntity<Entry> getEntry(@PathVariable Long entryId,
			@RequestHeader(name = HttpHeaders.IF_MODIFIED_SINCE) Optional<Instant> lastModifiedDate) {
		if (lastModifiedDate.isPresent()) {
			ResponseEntity<Void> head = this.entryClient.headEntry(entryId, lastModifiedDate.get());
			if (head.getStatusCode().isSameCodeAs(HttpStatus.NOT_MODIFIED)) {
				return ResponseEntity.status(HttpStatus.NOT_MODIFIED).build();
			}
		}
		ResponseEntity<Entry> response = this.entryClient.getEntry(entryId);
		return ResponseEntity.ok().headers(headers -> {
			long lastModified = response.getHeaders().getLastModified();
			if (lastModified != -1) {
				headers.setLastModified(lastModified);
			}
		}).cacheControl(swrCacheControl).body(response.getBody());
	}

	@GetMapping(path = "/api/tags")
	public ResponseEntity<List<Tag>> getTags() {
		return ResponseEntity.ok(this.entryClient.getTags().getBody());
	}

	@GetMapping(path = "/api/categories")
	public ResponseEntity<List<List<Category>>> getCategories() {
		return ResponseEntity.ok(this.entryClient.getCategories().getBody());
	}

}
