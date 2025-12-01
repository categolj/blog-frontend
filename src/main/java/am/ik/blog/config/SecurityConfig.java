package am.ik.blog.config;

import am.ik.blog.ratelimit.RateLimitFilter;
import am.ik.blog.ratelimit.RateLimitProperties;

import org.springframework.beans.factory.ObjectProvider;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration(proxyBeanMethods = false)
@EnableConfigurationProperties(RateLimitProperties.class)
public class SecurityConfig {

	@Bean
	@ConditionalOnProperty(name = "rate-limit.enabled", havingValue = "true")
	public RateLimitFilter rateLimitFilter(RateLimitProperties rateLimitProperties) {
		return new RateLimitFilter(rateLimitProperties.maxRequests(), rateLimitProperties.window().toMillis());
	}

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http,
			ObjectProvider<RateLimitFilter> rateLimitFilterProvider) throws Exception {
		rateLimitFilterProvider
			.ifAvailable(filter -> http.addFilterBefore(filter, UsernamePasswordAuthenticationFilter.class));
		return http.authorizeHttpRequests(authorize -> authorize
		// @formatter:off
				.requestMatchers("/api/google/**").authenticated()
				.requestMatchers(HttpMethod.POST,"/api/entries/{entryId}/comments").authenticated()
				.requestMatchers(HttpMethod.DELETE,"/api/comments/{commentId}").authenticated()
				.anyRequest().permitAll()
		// @formatter:on
		)
			.oauth2Login(Customizer.withDefaults())
			.csrf(csrf -> csrf.ignoringRequestMatchers("/api/counter", "/api/token", "/api/notes/**", "/api/readers",
					"/api/readers/**", "/api/password_reset", "/api/password_reset/**"))
			.build();
	}

}
