package am.ik.blog.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration(proxyBeanMethods = false)
public class SecurityConfig {

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		return http.authorizeHttpRequests(authorize -> authorize
		// @formatter:off
				.requestMatchers("/api/google/**").authenticated()
				.requestMatchers(HttpMethod.POST,"/api/entries/{entryId}/comments").authenticated()
				.requestMatchers(HttpMethod.DELETE,"/api/comments/{commentId}").authenticated()
				.anyRequest().permitAll()
		// @formatter:on
		).oauth2Login(Customizer.withDefaults()).csrf(Customizer.withDefaults()).build();
	}

}