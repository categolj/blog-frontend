package am.ik.blog.entry;

import am.ik.blog.BlogApiProps;
import am.ik.blog.entry.model.CursorPageEntryInstant;
import am.ik.blog.entry.model.Entry;
import jakarta.annotation.Nullable;
import java.time.Instant;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;

import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@Component
public class EntryClient {

	private final RestClient restClient;

	public EntryClient(RestClient.Builder restClientBuilder, BlogApiProps props) {
		this.restClient = restClientBuilder.baseUrl(props.url())
			.defaultHeaders(headers -> headers.setBasicAuth("blog-ui", "empty"))
			.build();
	}

	public ResponseEntity<CursorPageEntryInstant> getEntries(EntryRequest request, @Nullable String tenantId) {
		return this.restClient.get()
			.uri(builder -> builder.path(prefix(tenantId) + "/entries").queryParams(request.toQueryParams()).build())
			.retrieve()
			.toEntity(new ParameterizedTypeReference<>() {
			});
	}

	public ResponseEntity<Entry> getEntry(long entryId, @Nullable String tenantId) {
		return this.restClient.get()
			.uri(prefix(tenantId) + "/entries/{entryId}", entryId)
			.retrieve()
			.onStatus(statusCode -> (statusCode == NOT_FOUND || statusCode == FORBIDDEN), (req, res) -> {
			})
			.toEntity(Entry.class);
	}

	public ResponseEntity<Void> headEntry(long entryId, Instant lastModifiedDate, @Nullable String tenantId) {
		return this.restClient.head().uri(prefix(tenantId) + "/entries/{entryId}", entryId).headers(headers -> {
			headers.setIfModifiedSince(lastModifiedDate);
		}).retrieve().toBodilessEntity();
	}

	static String prefix(@Nullable String tenantId) {
		if (StringUtils.hasText(tenantId)) {
			return "/tenants/" + tenantId;
		}
		else {
			return "";
		}
	}

}
