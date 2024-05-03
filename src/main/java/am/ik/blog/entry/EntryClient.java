package am.ik.blog.entry;

import java.time.Instant;

import am.ik.blog.BlogApiProps;
import am.ik.blog.entry.model.CursorPageEntryInstant;
import am.ik.blog.entry.model.Entry;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class EntryClient {

	private final RestClient restClient;

	public EntryClient(RestClient.Builder restClientBuilder, BlogApiProps props) {
		this.restClient = restClientBuilder.baseUrl(props.url())
			.defaultHeaders(headers -> headers.setBasicAuth("blog-ui", "empty"))
			.build();
	}

	public ResponseEntity<CursorPageEntryInstant> getEntries(EntryRequest request) {
		return this.restClient.get()
			.uri(builder -> builder.path("/entries").queryParams(request.toQueryParams()).build())
			.retrieve()
			.toEntity(new ParameterizedTypeReference<>() {
			});
	}

	public ResponseEntity<Entry> getEntry(long entryId) {
		return this.restClient.get().uri("/entries/{entryId}", entryId).retrieve().toEntity(Entry.class);
	}

	public ResponseEntity<Void> headEntry(long entryId, Instant lastModifiedDate) {
		return this.restClient.head().uri("/entries/{entryId}", entryId).headers(headers -> {
			headers.setIfModifiedSince(lastModifiedDate);
		}).retrieve().toBodilessEntity();
	}

}
