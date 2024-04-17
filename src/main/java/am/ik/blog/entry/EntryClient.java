package am.ik.blog.entry;

import java.util.Optional;

import am.ik.blog.BlogApiProps;
import am.ik.blog.model.Entry;
import am.ik.spring.http.client.RetryableClientHttpRequestInterceptor;

import org.springframework.stereotype.Component;
import org.springframework.util.backoff.FixedBackOff;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;

@Component
public class EntryClient {

	private final RestClient restClient;

	public EntryClient(RestClient.Builder restClientBuilder, BlogApiProps props) {
		this.restClient = restClientBuilder.baseUrl(props.url())
			.requestInterceptor(new RetryableClientHttpRequestInterceptor(new FixedBackOff(1_000, 2)))
			.build();
	}

	public Optional<Entry> getEntry(long entryId) {
		try {
			Entry entry = this.restClient.get()
				.uri("/entries/{entryId}", entryId)
				.headers(headers -> headers.setBasicAuth("blog-ui", "empty"))
				.retrieve()
				.body(Entry.class);
			return Optional.ofNullable(entry);
		}
		catch (HttpClientErrorException.NotFound notFound) {
			return Optional.empty();
		}
	}

}
