package am.ik.blog.security;

import am.ik.blog.config.SecurityConfig;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest
@Import(SecurityConfig.class)
class BotBlockingFilterTest {

	@Autowired
	MockMvc mvc;

	@Test
	void shouldBlockWordPressPathsWithWpPrefix() throws Exception {
		this.mvc.perform(get("/wp-admin")).andExpect(status().isGone());
		this.mvc.perform(get("/wp-login.php")).andExpect(status().isGone());
		this.mvc.perform(get("/wp-content/uploads/file.jpg")).andExpect(status().isGone());
		this.mvc.perform(get("/blog/wp-admin")).andExpect(status().isGone());
	}

	@Test
	void shouldAllowNormalPaths() throws Exception {
		this.mvc.perform(get("/test")).andExpect(status().isOk());
		this.mvc.perform(get("/api/entries")).andExpect(status().isOk());
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

		@GetMapping(path = "/api/entries", produces = MediaType.APPLICATION_JSON_VALUE)
		String entries() {
			return "{\"entries\":[]}";
		}

	}

}
