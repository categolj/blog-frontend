package am.ik.blog.ssr;

import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

@Component
public class ReactRendererWarmUpper implements ApplicationListener<ApplicationReadyEvent> {

	private final ReactRenderer reactRenderer;

	private final Logger logger = LoggerFactory.getLogger(ReactRendererWarmUpper.class);

	public ReactRendererWarmUpper(ReactRenderer reactRenderer) {
		this.reactRenderer = reactRenderer;
	}

	@Override
	public void onApplicationEvent(ApplicationReadyEvent event) {
		int iterations = Runtime.getRuntime().availableProcessors() * 2;
		try (ExecutorService executorService = Executors.newFixedThreadPool(iterations)) {
			for (int i = 0; i < iterations; i++) {
				int n = i + 1;
				executorService.execute(() -> {
					logger.info("Warming up ({}/{})", n, iterations);
					this.reactRenderer.render("/entries", Map.of());
				});
			}
		}
	}

}
