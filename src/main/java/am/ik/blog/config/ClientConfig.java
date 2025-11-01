package am.ik.blog.config;

import am.ik.spring.http.client.RetryableClientHttpRequestInterceptor;
import org.springframework.boot.restclient.RestClientCustomizer;
import org.springframework.boot.restclient.RestTemplateCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.backoff.ExponentialBackOff;

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
			RetryableClientHttpRequestInterceptor retryableClientHttpRequestInterceptor) {
		return restTemplate -> restTemplate.getInterceptors().add(retryableClientHttpRequestInterceptor);
	}

	@Bean
	public RestClientCustomizer restClientCustomizer(
			RetryableClientHttpRequestInterceptor retryableClientHttpRequestInterceptor) {
		return restClientBuilder -> restClientBuilder.requestInterceptor(retryableClientHttpRequestInterceptor);
	}

}
