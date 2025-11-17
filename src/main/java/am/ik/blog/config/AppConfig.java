package am.ik.blog.config;

import io.micrometer.core.instrument.config.MeterFilter;
import io.opentelemetry.api.common.AttributeKey;
import io.opentelemetry.api.trace.SpanKind;
import io.opentelemetry.contrib.sampler.RuleBasedRoutingSampler;
import io.opentelemetry.sdk.trace.samplers.Sampler;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanPostProcessor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration(proxyBeanMethods = false)
public class AppConfig {

	@Bean
	public static BeanPostProcessor ruleBasedRoutingSampler() {
		return new BeanPostProcessor() {
			@Override
			public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
				if (bean instanceof Sampler) {
					AttributeKey<String> uri = AttributeKey.stringKey("uri");
					return RuleBasedRoutingSampler.builder(SpanKind.SERVER, (Sampler) bean)
						.drop(uri, "^/readyz")
						.drop(uri, "^/livez")
						.drop(uri, "^/actuator")
						.drop(uri, "^/cloudfoundryapplication")
						.drop(uri, "^/_static")
						.build();
				}
				return bean;
			}
		};
	}

	@Bean
	public MeterFilter customMeterFilter() {
		return MeterFilter.deny(id -> {
			String uri = id.getTag("uri");
			return uri != null && (uri.startsWith("/readyz") || uri.startsWith("/livez") || uri.startsWith("/actuator")
					|| uri.startsWith("/cloudfoundryapplication") || uri.startsWith("/_static"));
		});
	}

	@Bean
	AccessLogger accessLogger() {
		return AccessLogger.builder().filter(httpExchange -> {
			String uri = httpExchange.getRequest().getUri().getPath();
			return uri != null && !(uri.equals("/readyz") || uri.equals("/livez") || uri.startsWith("/actuator")
					|| uri.startsWith("/cloudfoundryapplication") || uri.startsWith("/_static"));
		}).addKeyValues(true).build();
	}

}