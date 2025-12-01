package am.ik.blog.ratelimit;

import am.ik.blog.config.SecurityConfig;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest
@Import(SecurityConfig.class)
@TestPropertySource(properties = { "rate-limit.enabled=true", "rate-limit.max-requests=5", "rate-limit.window=1m" })
class RateLimitFilterTest {

	@Autowired
	MockMvc mvc;

	@Test
	void shouldReturn429WhenRateLimitExceeded() throws Exception {
		// First 5 requests should succeed
		for (int i = 0; i < 5; i++) {
			this.mvc.perform(get("/test")).andExpect(status().isOk());
		}

		// 6th request should be rate limited
		this.mvc.perform(get("/test"))
			.andExpect(status().isTooManyRequests())
			.andExpect(jsonPath("$.error").value("Too many requests. Please try again later."));
	}

	@Configuration(proxyBeanMethods = false)
	static class TestConfig {

		@Bean
		TestController testController() {
			return new TestController();
		}

	}

	@RestController
	static class TestController {

		@GetMapping(path = "/test", produces = MediaType.APPLICATION_JSON_VALUE)
		String test() {
			return "{\"message\":\"ok\"}";
		}

	}

}

@WebMvcTest
@Import(SecurityConfig.class)
@TestPropertySource(properties = { "rate-limit.enabled=false", "rate-limit.max-requests=5", "rate-limit.window=1m" })
class RateLimitFilterDisabledTest {

	@Autowired
	MockMvc mvc;

	@Test
	void shouldNotRateLimitWhenDisabled() throws Exception {
		// All requests should succeed even beyond the max-requests limit
		for (int i = 0; i < 10; i++) {
			this.mvc.perform(get("/test")).andExpect(status().isOk());
		}
	}

	@Configuration(proxyBeanMethods = false)
	static class TestConfig {

		@Bean
		RateLimitFilterTest.TestController testController() {
			return new RateLimitFilterTest.TestController();
		}

	}

}
