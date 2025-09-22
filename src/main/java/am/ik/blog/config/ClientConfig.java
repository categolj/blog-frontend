package am.ik.blog.config;

import am.ik.spring.http.client.RetryableClientHttpRequestInterceptor;
import java.util.List;
import org.springframework.boot.web.client.RestClientCustomizer;
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
	public RetryableClientHttpRequestInterceptor requestInterceptor(ObservableRetryLifecycle retryLifecycle) {
		ExponentialBackOff backOff = new ExponentialBackOff(1_000, 1.5);
		backOff.setMaxElapsedTime(12_000);
		return new RetryableClientHttpRequestInterceptor(backOff,
				opts -> opts.removeRetryableIOExceptions(defaults())
					.addRetryableIOException(ANY)
					.retryLifecycle(retryLifecycle));
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

}
