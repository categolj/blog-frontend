package am.ik.blog.entry;

import am.ik.blog.entry.model.Category;
import am.ik.blog.entry.model.Entry;
import am.ik.blog.entry.model.EntryKey;
import am.ik.blog.entry.model.TagAndCount;
import am.ik.pagination.CursorPage;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.springframework.aot.hint.annotation.RegisterReflectionForBinding;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class EntryController {

	private final EntryClient entryClient;

	private final ImageProxyReplacer imageProxyReplacer;

	private static final CacheControl swrCacheControl = CacheControl.maxAge(Duration.ofHours(1))
		.staleWhileRevalidate(Duration.ofMinutes(10));

	public EntryController(EntryClient entryClient, ImageProxyReplacer imageProxyReplacer) {
		this.entryClient = entryClient;
		this.imageProxyReplacer = imageProxyReplacer;
	}

	@GetMapping(path = { "/api/entries", "/api/tenants/{tenantId}/entries" })
	@RegisterReflectionForBinding(EntryRequest.class)
	public ResponseEntity<CursorPage<Entry, Instant>> getEntries(EntryRequest request,
			@PathVariable(required = false) String tenantId) {
		var response = this.entryClient.getEntries(request, tenantId);
		return ResponseEntity.ok().headers(headers -> {
			var page = response.getBody();
			if (page != null) {
				List<Entry> content = page.content();
				if (content != null && !content.isEmpty()) {
					Instant updated = content.getFirst().updated().date();
					headers.setLastModified(updated);
				}
			}
		}).cacheControl(swrCacheControl).body(response.getBody());
	}

	@GetMapping(path = { "/api/entries/{entryId}", "/api/tenants/{tenantId}/entries/{entryId}" })
	public ResponseEntity<?> getEntry(@PathVariable Long entryId,
			@RequestHeader(name = HttpHeaders.IF_MODIFIED_SINCE) Optional<Instant> lastModifiedDate,
			@PathVariable(required = false) String tenantId) {
		if (lastModifiedDate.isPresent()) {
			ResponseEntity<Void> head = this.entryClient.headEntry(entryId, lastModifiedDate.get(), tenantId);
			if (head.getStatusCode().isSameCodeAs(HttpStatus.NOT_MODIFIED)) {
				return ResponseEntity.status(HttpStatus.NOT_MODIFIED).build();
			}
		}
		ResponseEntity<Entry> response = this.entryClient.getEntry(entryId, tenantId);
		if (response.getStatusCode() == HttpStatus.NOT_FOUND) {
			return ResponseEntity.status(response.getStatusCode())
				.body(ProblemDetail.forStatusAndDetail(response.getStatusCode(),
						"Entry not found (%s)".formatted(new EntryKey(entryId, tenantId))));
		}
		else if (response.getStatusCode() == HttpStatus.FORBIDDEN) {
			return ResponseEntity.status(response.getStatusCode())
				.body(ProblemDetail.forStatusAndDetail(response.getStatusCode(),
						"Forbidden (%s)".formatted(new EntryKey(entryId, tenantId))));
		}
		return ResponseEntity.ok().headers(headers -> {
			long lastModified = response.getHeaders().getLastModified();
			if (lastModified != -1) {
				headers.setLastModified(lastModified);
			}
		}).cacheControl(swrCacheControl).body(this.imageProxyReplacer.replaceImage(response.getBody()));
	}

	@GetMapping(path = "/api/tags")
	public ResponseEntity<List<TagAndCount>> getTags() {
		ResponseEntity<List<TagAndCount>> tags = this.entryClient.getTags(null);
		return ResponseEntity.ok(tags.getBody());
	}

	@GetMapping(path = "/api/categories")
	public ResponseEntity<List<List<Category>>> getCategories() {
		ResponseEntity<List<List<Category>>> categories = this.entryClient.getCategories(null);
		return ResponseEntity.ok(categories.getBody());
	}

}
