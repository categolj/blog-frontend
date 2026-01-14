package am.ik.blog;

import am.ik.blog.mockserver.MockServer;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.test.context.DynamicPropertyRegistrar;
import org.springframework.test.util.TestSocketUtils;

@TestConfiguration(proxyBeanMethods = false)
public class MockConfig {

	@Bean
	MockServer mockServer() {
		int availableTcpPort = TestSocketUtils.findAvailableTcpPort();
		MockServer mockServer = new MockServer(availableTcpPort);
		mockServer.run();
		return mockServer;
	}

	@Bean
	DynamicPropertyRegistrar dynamicPropertyRegistrar(MockServer mockServer) {
		return registry -> {
			int mockPort = mockServer.port();
			registry.add("blog-api.url", () -> "http://127.0.0.1:%d".formatted(mockPort));
			registry.add("counter-api.url", () -> "http://127.0.0.1:%d".formatted(mockPort));
		};
	}

}
