package am.ik.blog.config;

import am.ik.blog.BlogApiProps;
import am.ik.blog.entry.api.CategoryApi;
import am.ik.blog.entry.api.EntryApi;
import am.ik.blog.entry.api.TagApi;
import am.ik.blog.entry.invoker.ApiClient;
import am.ik.spring.http.client.RetryableClientHttpRequestInterceptor;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.backoff.FixedBackOff;

@Configuration(proxyBeanMethods = false)
public class ClientConfig {

	@Bean
	public ApiClient entryApiClient(RestTemplateBuilder builder, BlogApiProps props) {
		return new ApiClient(
				builder.additionalInterceptors(new RetryableClientHttpRequestInterceptor(new FixedBackOff(1_000, 2)))
					.basicAuthentication("blog-ui", "empty")
					.build())
			.setBasePath(props.url());
	}

	@Bean
	public EntryApi entryApi(ApiClient entryApiClient) {
		return new EntryApi(entryApiClient);
	}

	@Bean
	public TagApi tagApi(ApiClient entryApiClient) {
		return new TagApi(entryApiClient);
	}

	@Bean
	public CategoryApi categoryApi(ApiClient entryApiClient) {
		return new CategoryApi(entryApiClient);
	}

}
