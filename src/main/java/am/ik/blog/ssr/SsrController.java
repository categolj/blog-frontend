package am.ik.blog.ssr;

import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import am.ik.blog.entry.EntryClient;
import am.ik.blog.entry.EntryRequest;
import am.ik.blog.entry.EntryRequestBuilder;
import am.ik.blog.entry.api.CategoryApi;
import am.ik.blog.entry.api.TagApi;
import jakarta.annotation.Nullable;

import org.springframework.http.HttpStatus;
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

	private final TagApi tagApi;

	private final CategoryApi categoryApi;

	static final Pattern scriptPattern = Pattern.compile("<script[^>]*>.*?</script>",
			Pattern.DOTALL | Pattern.CASE_INSENSITIVE);

	public SsrController(ReactRenderer reactRenderer, EntryClient entryClient, TagApi tagApi, CategoryApi categoryApi) {
		this.reactRenderer = reactRenderer;
		this.entryClient = entryClient;
		this.tagApi = tagApi;
		this.categoryApi = categoryApi;
	}

	@GetMapping(path = "/")
	public String index() {
		return this.entries(EntryRequestBuilder.entryRequest().build(), null);
	}

	@GetMapping(path = { "/entries", "/entries/{tenantId:[a-z]+}" })
	@SuppressWarnings("UnnecessaryParentheses")
	public String entries(EntryRequest request, @Nullable @PathVariable(required = false) String tenantId) {
		var entries = this.entryClient.getEntries(request, tenantId).getBody();
		return this.reactRenderer.render(
				"/entries" + ((StringUtils.hasText(request.query()) ? "?query=" + request.query() : "")),
				Map.of("preLoadedEntries", Objects.requireNonNull(entries)));
	}

	@GetMapping(path = { "/entries/{entryId:[0-9]+}", "/entries/{entryId:[0-9]+}/{tenantId:[a-z]+}" })
	public ResponseEntity<String> entry(@PathVariable long entryId,
			@Nullable @PathVariable(required = false) String tenantId) {
		var entry = this.entryClient.getEntry(entryId, tenantId).getBody();
		Matcher matcher = scriptPattern.matcher(Objects.requireNonNull(entry).getContent());
		return ResponseEntity.ok(this.reactRenderer.render("/entries/%d".formatted(entryId),
				Map.of("preLoadedEntry", Objects.requireNonNull(entry).content(matcher.replaceAll("")))));
	}

	@GetMapping(path = "/entry/view/id/{entryId:[0-9]+}/**")
	public ResponseEntity<Void> redirectLegacyUrl(@PathVariable long entryId, UriComponentsBuilder builder) {
		return ResponseEntity.status(HttpStatus.MOVED_PERMANENTLY)
			.location(builder.path("/entries/{entryId}").build(entryId))
			.build();
	}

	@GetMapping(path = "/tags")
	public String tags() {
		var tags = this.tagApi.tags();
		return this.reactRenderer.render("/tags", Map.of("preLoadedTags", Objects.requireNonNull(tags)));
	}

	@GetMapping(path = "/categories")
	public String categories() {
		var categories = this.categoryApi.categories();
		return this.reactRenderer.render("/categories",
				Map.of("preLoadedCategories", Objects.requireNonNull(categories)));
	}

	@GetMapping(path = "/aboutme")
	public String aboutme() {
		return this.reactRenderer.render("/aboutme", Map.of());
	}

	@GetMapping(path = { "/note/login" })
	public String noteLogin() {
		return this.reactRenderer.render("/note/login", Map.of());
	}

	@GetMapping(path = { "/note/signup" })
	public String noteSignup() {
		return this.reactRenderer.render("/note/signup", Map.of());
	}

	@GetMapping(path = { "/note/password_reset/{resetId}" })
	public String notePasswordReset(@PathVariable UUID resetId) {
		return this.reactRenderer.render("/note/password_reset/" + resetId, Map.of());
	}

	@GetMapping(path = { "/tags/*/entries", "/categories/*/entries", "/notes/**", "/note/**", "/info" })
	public String noSsr() {
		return this.reactRenderer.render("/", Map.of());
	}

	@ExceptionHandler(RestClientResponseException.class)
	public ResponseEntity<String> handleRestClientResponseException(RestClientResponseException e) {
		return ResponseEntity.status(e.getStatusCode()).body(this.reactRenderer.render("/", Map.of()));
	}

}
