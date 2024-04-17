package am.ik.blog.entry;

import java.time.Instant;
import java.util.Optional;

import am.ik.blog.BlogApiProps;
import am.ik.blog.model.Entry;
import am.ik.pagination.CursorPage;
import am.ik.spring.http.client.RetryableClientHttpRequestInterceptor;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.backoff.FixedBackOff;
import org.springframework.web.client.RestClient;

@Component
public class EntryClient {

	private final RestClient restClient;

	public EntryClient(RestClient.Builder restClientBuilder, BlogApiProps props) {
		this.restClient = restClientBuilder.baseUrl(props.url())
			.requestInterceptor(new RetryableClientHttpRequestInterceptor(new FixedBackOff(1_000, 2)))
			.build();
	}

	public ResponseEntity<CursorPage<Entry, Instant>> getEntries(Optional<Instant> cursor) {
		return this.restClient.get()
			.uri("/entries?cursor=%s".formatted(cursor.map(Instant::toString).orElse("")))
			.retrieve()
			.toEntity(new ParameterizedTypeReference<>() {
			});
	}

	public ResponseEntity<Entry> getEntry(long entryId) {
		return this.restClient.get()
			.uri("/entries/{entryId}", entryId)
			.headers(headers -> headers.setBasicAuth("blog-ui", "empty"))
			.retrieve()
			.toEntity(Entry.class);
	}

	public ResponseEntity<Void> headEntry(long entryId, String ifModifiedSince) {
		return this.restClient.head()
			.uri("/entries/{entryId}", entryId)
			.headers(headers -> headers.setBasicAuth("blog-ui", "empty"))
			.header(HttpHeaders.IF_MODIFIED_SINCE, ifModifiedSince)
			.retrieve()
			.toBodilessEntity();
	}

}
