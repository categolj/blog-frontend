package am.ik.blog.ssr;

import java.util.Map;
import java.util.Objects;

import am.ik.blog.entry.EntryClient;
import am.ik.blog.entry.EntryRequest;
import am.ik.blog.entry.EntryRequestBuilder;
import am.ik.blog.entry.api.CategoryApi;
import am.ik.blog.entry.api.TagApi;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SsrController {

	private final ReactRenderer reactRenderer;

	private final EntryClient entryClient;

	private final TagApi tagApi;

	private final CategoryApi categoryApi;

	public SsrController(ReactRenderer reactRenderer, EntryClient entryClient, TagApi tagApi, CategoryApi categoryApi) {
		this.reactRenderer = reactRenderer;
		this.entryClient = entryClient;
		this.tagApi = tagApi;
		this.categoryApi = categoryApi;
	}

	@GetMapping(path = "/")
	public String index() {
		return this.entries(EntryRequestBuilder.entryRequest().build());
	}

	@GetMapping(path = "/entries")
	public String entries(EntryRequest request) {
		var entries = this.entryClient.getEntries(request).getBody();
		return this.reactRenderer.render("/", Map.of("preLoadedEntries", Objects.requireNonNull(entries)));
	}

	@GetMapping(path = "/entries/{entryId}")
	public String post(@PathVariable long entryId) {
		var entry = this.entryClient.getEntry(entryId).getBody();
		return this.reactRenderer.render("/entries/%d".formatted(entryId),
				Map.of("preLoadedEntry", Objects.requireNonNull(entry)));
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

	@GetMapping(path = { "/tags/*/entries", "/categories/*/entries", "/notes/**", "/note/readers/*/activations/*",
			"/info" })
	public String noSsr() {
		return this.reactRenderer.render("/", Map.of());
	}

}
