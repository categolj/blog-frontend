package am.ik.blog.entry;

import am.ik.blog.entry.api.CategoryApi;
import am.ik.blog.entry.api.TagApi;
import am.ik.blog.entry.model.Category;
import am.ik.blog.entry.model.CursorPageEntryInstant;
import am.ik.blog.entry.model.Entry;
import am.ik.blog.entry.model.TagAndCount;
import java.time.Duration;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.springframework.aot.hint.annotation.RegisterReflectionForBinding;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class EntryController {

	private final EntryClient entryClient;

	private final ImageProxyReplacer imageProxyReplacer;

	private final TagApi tagApi;

	private final CategoryApi categoryApi;

	private static final CacheControl swrCacheControl = CacheControl.maxAge(Duration.ofHours(1))
		.staleWhileRevalidate(Duration.ofMinutes(10));

	public EntryController(EntryClient entryClient, ImageProxyReplacer imageProxyReplacer, TagApi tagApi,
			CategoryApi categoryApi) {
		this.entryClient = entryClient;
		this.imageProxyReplacer = imageProxyReplacer;
		this.tagApi = tagApi;
		this.categoryApi = categoryApi;
	}

	@GetMapping(path = { "/api/entries", "/api/tenants/{tenantId}/entries" })
	@RegisterReflectionForBinding(EntryRequest.class)
	public ResponseEntity<CursorPageEntryInstant> getEntries(EntryRequest request,
			@PathVariable(required = false) String tenantId) {
		ResponseEntity<CursorPageEntryInstant> response = this.entryClient.getEntries(request, tenantId);
		return ResponseEntity.ok().headers(headers -> {
			var page = response.getBody();
			if (page != null) {
				List<Entry> content = page.getContent();
				if (content != null && !content.isEmpty()) {
					OffsetDateTime updated = content.getFirst().getUpdated().getDate();
					headers.setLastModified(Objects.requireNonNull(updated).toInstant());
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
		return ResponseEntity.ok(this.tagApi.tags());
	}

	@GetMapping(path = "/api/categories")
	public ResponseEntity<List<List<Category>>> getCategories() {
		return ResponseEntity.ok(this.categoryApi.categories());
	}

	record EntryKey(Long entryId, @Nullable String tenantId) {
		@Override
		public String toString() {
			return (tenantId == null ? "" : "tenantId=" + tenantId + ", ") + "entryId=" + entryId;
		}
	}

}
