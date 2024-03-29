package am.ik.blog.entries;

import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import am.ik.blog.counter.CounterClient;
import am.ik.blog.prometheus.PrometheusClient;
import am.ik.blog.translation.TranslationClient;
import com.fasterxml.jackson.databind.JsonNode;
import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import is.tagomor.woothee.Classifier;
import is.tagomor.woothee.crawler.Google;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import org.springframework.core.io.ClassPathResource;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Controller;
import org.springframework.web.reactive.function.server.RequestPredicate;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;

import static org.springframework.http.HttpHeaders.USER_AGENT;

@Controller
public class BlogHandler {
	private final TranslationClient translationClient;

	private final CounterClient counterClient;

	private final PrerenderClient prerenderClient;

	private final PrometheusClient prometheusClient;

	private final MeterRegistry meterRegistry;

	private final Counter prerenderCounter;

	public BlogHandler(TranslationClient translationClient, CounterClient counterClient, PrerenderClient prerenderClient, PrometheusClient prometheusClient, MeterRegistry meterRegistry1, MeterRegistry meterRegistry) {
		this.translationClient = translationClient;
		this.counterClient = counterClient;
		this.prerenderClient = prerenderClient;
		this.prometheusClient = prometheusClient;
		this.meterRegistry = meterRegistry1;
		this.prerenderCounter = Counter.builder("prerender").register(meterRegistry);
	}

	public RouterFunction<ServerResponse> routes() {
		return RouterFunctions.route()
				.route(forwardToPrerender(), this::prerender)
				.GET("/", this::render)
				.GET("/entries/{entryId}/read_count", this::readCount)
				.GET("/entries/read_count", this::readCountAll)
				.GET("/entries/{entryId}/{language}", this::renderEntryForTranslation)
				.GET("/entries/{entryId}", this::renderEntry)
				.GET("/entries/**", this::render)
				.GET("/translations/{entryId}", this::translateEntry)
				.GET("/series/**", this::render)
				.GET("/tags/**", this::render)
				.GET("/categories/**", this::render)
				.GET("/notes/**", this::render)
				.GET("/note/**", this::render)
				.GET("/eventviewer", this::render)
				.GET("/aboutme", this::render)
				//.GET("/info", this::render)
				.GET("/dashboard", this::render)
				.build();
	}

	private void countUp(ServerRequest req, String language) {
		final String userAgent = req.headers().firstHeader(USER_AGENT);
		if (!userAgent.startsWith("Go-http-client") && !userAgent.startsWith("Prometheus")) {
			final boolean browser = isBrowser(req);
			final String entryId = req.pathVariable("entryId");
			this.meterRegistry
					.counter("entry.read",
							"entry_id", entryId,
							"browser", String.valueOf(browser),
							"language", language)
					.increment();
			this.counterClient.increment(Long.parseLong(entryId), browser)
					.subscribe();
		}
	}

	@NonNull
	private Mono<ServerResponse> renderEntry(ServerRequest req) {
		this.countUp(req, "ja");
		return this.render(req);
	}

	@NonNull
	private Mono<ServerResponse> renderEntryForTranslation(ServerRequest req) {
		return this.render(req);
	}

	@NonNull
	private Mono<ServerResponse> translateEntry(ServerRequest req) {
		final String entryId = req.pathVariable("entryId");
		final String language = req.queryParam("language").orElse("en");
		this.countUp(req, language);
		return this.translationClient.translate(Long.parseLong(entryId), language)
				.flatMap(body -> ServerResponse.ok()
						.contentType(MediaType.APPLICATION_JSON)
						.bodyValue(body))
				.switchIfEmpty(ServerResponse.notFound()
						.build());
	}

	@NonNull
	private Mono<ServerResponse> prerender(ServerRequest req) {
		final String url = req.uri().toString();
		this.prerenderCounter.increment();
		final Mono<String> content = this.prerenderClient.invoke(req.method(), url);
		return content
				.flatMap(html -> ServerResponse.ok()
						.contentType(MediaType.TEXT_HTML)
						.cacheControl(CacheControl.maxAge(Duration.ofDays(3)))
						.bodyValue(html))
				.switchIfEmpty(ServerResponse.notFound()
						.build());
	}

	@NonNull
	private Mono<ServerResponse> render(ServerRequest req) {
		return ServerResponse.ok().bodyValue(new ClassPathResource("META-INF/resources/index.html"));
	}

	@NonNull
	private Mono<ServerResponse> readCount(ServerRequest req) {
		final String entryId = req.pathVariable("entryId");
		final Instant to = Instant.now();
		final Instant from = to.minus(7, ChronoUnit.DAYS);
		final Flux<JsonNode> body = this.counterClient.reportForEntryByBrowser(Long.parseLong(entryId), from, to);
		return ServerResponse.ok().body(body, JsonNode.class);
	}

	@NonNull
	private Mono<ServerResponse> readCountAll(ServerRequest req) {
		final Instant to = Instant.now();
		final Instant from = to.minus(7, ChronoUnit.DAYS);
		final Flux<JsonNode> body = this.counterClient.reportByBrowser(from, to);
		return ServerResponse.ok().body(body, JsonNode.class);
	}

	private static RequestPredicate forwardToPrerender() {
		return req -> {
			final String path = req.path();
			if ("/".equals(path) || path.startsWith("/entries") || path.startsWith("/series") || path.startsWith("/tags") || path.startsWith("/categories")) {
				return isPrerenderedMethod(req) && isNotPrerenderedRequest(req) && isPrerenderedUser(req);
			}
			return false;
		};
	}

	private static boolean isBrowser(ServerRequest req) {
		final String userAgent = req.headers().firstHeader(USER_AGENT);
		return userAgent != null && !userAgent.toLowerCase().contains("bot") && !userAgent.toLowerCase().contains("headless") && isNotPrerenderedRequest(req) && Classifier.tryBrowser(userAgent, new HashMap<>(6, 1.0f));
	}

	private static boolean isNotPrerenderedRequest(ServerRequest req) {
		return req.headers().header("X-Prerender").isEmpty();
	}

	private static boolean isPrerenderedMethod(ServerRequest req) {
		final HttpMethod method = req.method();
		return method == HttpMethod.GET || method == HttpMethod.HEAD;
	}

	private static boolean isPrerenderedUser(ServerRequest req) {
		return isGoogle(req) || isTwitter(req) || isSlack(req) || isHatena(req);
	}

	private static boolean isGoogle(ServerRequest req) {
		final List<String> headers = req.headers().header(HttpHeaders.REFERER);
		if (!headers.isEmpty() && headers.get(0).startsWith("https://translate.googleusercontent.com")) {
			return true;
		}
		final String userAgent = req.headers().firstHeader(USER_AGENT);
		return userAgent != null && Google.challenge(userAgent, new HashMap<>(6, 1.0f));
	}

	private static boolean isTwitter(ServerRequest req) {
		final String userAgent = req.headers().firstHeader(USER_AGENT);
		return userAgent != null && userAgent.startsWith("Twitter");
	}

	private static boolean isSlack(ServerRequest req) {
		final String userAgent = req.headers().firstHeader(USER_AGENT);
		return userAgent != null && userAgent.startsWith("Slack");
	}

	private static boolean isHatena(ServerRequest req) {
		final String userAgent = req.headers().firstHeader(USER_AGENT);
		return userAgent != null && !userAgent.startsWith("Hatena::Russia") && userAgent.startsWith("Hatena");
	}

	private static boolean isHuman(ServerRequest req) {
		final String userAgent = req.headers().firstHeader(USER_AGENT);
		final Map<String, String> result = Classifier.parse(userAgent);
		final String category = result.get("category");
		return "pc".equals(category) || "smartphone".equals(category) || "mobilephone".equals(category);
	}
}
