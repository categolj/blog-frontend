package am.ik.blog.config;

import am.ik.blog.BlogApiProps;
import am.ik.blog.NoteApiProps;
import am.ik.blog.entry.api.CategoryApi;
import am.ik.blog.entry.api.EntryApi;
import am.ik.blog.entry.api.TagApi;
import am.ik.blog.note.NoteTokenInterceptor;
import am.ik.note.api.NoteApi;
import am.ik.note.api.PasswordResetApi;
import am.ik.note.api.ReaderApi;
import am.ik.note.api.TokenApi;
import am.ik.note.invoker.ApiClient;
import am.ik.spring.http.client.RetryableClientHttpRequestInterceptor;
import java.time.Duration;
import java.util.List;
import org.springframework.boot.web.client.RestClientCustomizer;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.boot.web.client.RestTemplateCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.backoff.ExponentialBackOff;
import org.zalando.logbook.spring.LogbookClientHttpRequestInterceptor;

import static am.ik.spring.http.client.RetryableIOExceptionPredicate.ANY;
import static am.ik.spring.http.client.RetryableIOExceptionPredicate.defaults;

@Configuration(proxyBeanMethods = false)
public class ClientConfig {

	@Bean
	public RetryableClientHttpRequestInterceptor requestInterceptor() {
		ExponentialBackOff backOff = new ExponentialBackOff(1_000, 2);
		backOff.setMaxElapsedTime(Duration.ofSeconds(12).toMillis());
		return new RetryableClientHttpRequestInterceptor(backOff,
				opts -> opts.removeRetryableIOExceptions(defaults()).addRetryableIOException(ANY));
	}

	@Bean
	public RestTemplateCustomizer restTemplateCustomizer(
			LogbookClientHttpRequestInterceptor logbookClientHttpRequestInterceptor,
			RetryableClientHttpRequestInterceptor retryableClientHttpRequestInterceptor) {
		return restTemplate -> restTemplate.getInterceptors()
			.addAll(List.of(logbookClientHttpRequestInterceptor, retryableClientHttpRequestInterceptor));
	}

	@Bean
	public RestClientCustomizer restClientCustomizer(
			LogbookClientHttpRequestInterceptor logbookClientHttpRequestInterceptor,
			RetryableClientHttpRequestInterceptor retryableClientHttpRequestInterceptor) {
		return restClientBuilder -> restClientBuilder.requestInterceptor(logbookClientHttpRequestInterceptor)
			.requestInterceptor(retryableClientHttpRequestInterceptor);
	}

	@Bean
	public am.ik.blog.entry.invoker.ApiClient apiClient(RestTemplateBuilder builder, BlogApiProps props) {
		return new am.ik.blog.entry.invoker.ApiClient(builder.basicAuthentication("blog-ui", "empty").build())
			.setBasePath(props.url());
	}

	@Bean
	public am.ik.note.invoker.ApiClient noteApiClient(RestTemplateBuilder builder,
			NoteTokenInterceptor noteTokenInterceptor, NoteApiProps props) {
		return new ApiClient(builder.additionalInterceptors(noteTokenInterceptor).build()).setBasePath(props.url());
	}

	@Bean
	public EntryApi entryApi(am.ik.blog.entry.invoker.ApiClient apiClient) {
		return new EntryApi(apiClient);
	}

	@Bean
	public TagApi tagApi(am.ik.blog.entry.invoker.ApiClient apiClient) {
		return new TagApi(apiClient);
	}

	@Bean
	public CategoryApi categoryApi(am.ik.blog.entry.invoker.ApiClient apiClient) {
		return new CategoryApi(apiClient);
	}

	@Bean
	public am.ik.blog.entry.api.InfoApi entryInfoApi(am.ik.blog.entry.invoker.ApiClient apiClient) {
		return new am.ik.blog.entry.api.InfoApi(apiClient);
	}

	@Bean
	public NoteApi noteApi(am.ik.note.invoker.ApiClient apiClient) {
		return new NoteApi(apiClient);
	}

	@Bean
	public TokenApi tokenApi(am.ik.note.invoker.ApiClient apiClient) {
		return new TokenApi(apiClient);
	}

	@Bean
	public ReaderApi readerApi(am.ik.note.invoker.ApiClient apiClient) {
		return new ReaderApi(apiClient);
	}

	@Bean
	public PasswordResetApi passwordResetApi(am.ik.note.invoker.ApiClient apiClient) {
		return new PasswordResetApi(apiClient);
	}

	@Bean
	public am.ik.note.api.InfoApi noteInfoApi(am.ik.note.invoker.ApiClient apiClient) {
		return new am.ik.note.api.InfoApi(apiClient);
	}

}
