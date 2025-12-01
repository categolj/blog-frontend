package am.ik.blog.ratelimit;

import java.time.Duration;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.bind.DefaultValue;

@ConfigurationProperties(prefix = "rate-limit")
public record RateLimitProperties(@DefaultValue("false") boolean enabled, @DefaultValue("100") int maxRequests,
		@DefaultValue("1m") Duration window) {
}
