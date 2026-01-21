package am.ik.blog.ssr;

import am.ik.blog.entry.EntryClient;
import am.ik.blog.entry.EntryRequest;
import am.ik.blog.entry.EntryRequestBuilder;
import am.ik.blog.entry.ImageProxyReplacer;
import am.ik.blog.entry.model.Entry;
import jakarta.annotation.Nullable;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.util.UriComponentsBuilder;

@RestController
public class SsrController {

	private final ReactRenderer reactRenderer;

	private final EntryClient entryClient;

	private final ImageProxyReplacer imageProxyReplacer;

	static final Pattern scriptPattern = Pattern.compile("<script[^>]*>.*?</script>",
			Pattern.DOTALL | Pattern.CASE_INSENSITIVE);

	public SsrController(ReactRenderer reactRenderer, EntryClient entryClient, ImageProxyReplacer imageProxyReplacer) {
		this.reactRenderer = reactRenderer;
		this.entryClient = entryClient;
		this.imageProxyReplacer = imageProxyReplacer;
	}

	@GetMapping(path = "/", produces = MediaType.TEXT_HTML_VALUE)
	public String index() {
		return this.entries(EntryRequestBuilder.entryRequest().build(), null);
	}

	@GetMapping(path = { "/entries", "/entries/{tenantId:[a-z]+}" }, produces = MediaType.TEXT_HTML_VALUE)
	@SuppressWarnings("UnnecessaryParentheses")
	public String entries(EntryRequest request, @Nullable @PathVariable(required = false) String tenantId) {
		var entries = this.entryClient.getEntries(request, tenantId).getBody();
		String path = "/entries" + (StringUtils.hasText(tenantId) ? "/" + tenantId : "")
				+ ((StringUtils.hasText(request.query()) ? "?query=" + request.query() : ""));
		return this.reactRenderer.render(path, Map.of("preLoadedEntries", Objects.requireNonNull(entries)));
	}

	@GetMapping(path = { "/entries/{entryId:[0-9]+}", "/entries/{entryId:[0-9]+}/{tenantId:[a-z]+}" },
			produces = MediaType.TEXT_HTML_VALUE)
	public ResponseEntity<String> entry(@PathVariable long entryId,
			@Nullable @PathVariable(required = false) String tenantId) {
		ResponseEntity<Entry> response = this.entryClient.getEntry(entryId, tenantId);
		if (response.getStatusCode() == HttpStatus.NOT_FOUND) {
			return ResponseEntity.status(response.getStatusCode())
				.contentType(MediaType.TEXT_HTML)
				.body(this.reactRenderer.render("/notfound", Map.of()));
		}
		else if (response.getStatusCode() == HttpStatus.FORBIDDEN) {
			return ResponseEntity.status(response.getStatusCode())
				.contentType(MediaType.TEXT_HTML)
				.body(this.reactRenderer.render("/forbidden", Map.of()));
		}
		var entry = this.imageProxyReplacer.replaceImage(Objects.requireNonNull(response.getBody()));
		Matcher matcher = scriptPattern.matcher(Objects.requireNonNull(entry.content()));
		String path = "/entries/%d".formatted(entryId) + (StringUtils.hasText(tenantId) ? "/" + tenantId : "");
		return ResponseEntity.ok()
			.contentType(MediaType.TEXT_HTML)
			.body(this.reactRenderer.render(path,
					Map.of("preLoadedEntry", entry.toBuilder().content(matcher.replaceAll("")).build())));
	}

	@GetMapping(path = "/entry/view/id/{entryId:[0-9]+}/**")
	public ResponseEntity<Void> redirectLegacyUrl(@PathVariable long entryId, UriComponentsBuilder builder) {
		return ResponseEntity.status(HttpStatus.MOVED_PERMANENTLY)
			.location(builder.path("/entries/{entryId}").build(entryId))
			.build();
	}

	@GetMapping(path = "/tags", produces = MediaType.TEXT_HTML_VALUE)
	public String tags() {
		var tags = this.entryClient.getTags(null).getBody();
		return this.reactRenderer.render("/tags", Map.of("preLoadedTags", Objects.requireNonNull(tags)));
	}

	@GetMapping(path = "/categories", produces = MediaType.TEXT_HTML_VALUE)
	public String categories() {
		var categories = this.entryClient.getCategories(null).getBody();
		return this.reactRenderer.render("/categories",
				Map.of("preLoadedCategories", Objects.requireNonNull(categories)));
	}

	@GetMapping(path = "/aboutme", produces = MediaType.TEXT_HTML_VALUE)
	public String aboutme() {
		return this.reactRenderer.render("/aboutme", Map.of());
	}

	@GetMapping(path = { "/note/login" }, produces = MediaType.TEXT_HTML_VALUE)
	public String noteLogin() {
		return this.reactRenderer.render("/note/login", Map.of());
	}

	@GetMapping(path = { "/note/signup" }, produces = MediaType.TEXT_HTML_VALUE)
	public String noteSignup() {
		return this.reactRenderer.render("/note/signup", Map.of());
	}

	@GetMapping(path = { "/note/password_reset/{resetId}" }, produces = MediaType.TEXT_HTML_VALUE)
	public String notePasswordReset(@PathVariable UUID resetId) {
		return this.reactRenderer.render("/note/password_reset/" + resetId, Map.of());
	}

	@GetMapping(path = { "/tags/*/entries", "/categories/*/entries", "/notes/**", "/note/**", "/info" },
			produces = MediaType.TEXT_HTML_VALUE)
	public String noSsr() {
		return this.reactRenderer.render("/", Map.of());
	}

	@ExceptionHandler(RestClientResponseException.class)
	public ResponseEntity<String> handleRestClientResponseException(RestClientResponseException e) {
		return ResponseEntity.status(e.getStatusCode())
			.contentType(MediaType.TEXT_HTML)
			.body(this.reactRenderer.render("/", Map.of()));
	}

}
