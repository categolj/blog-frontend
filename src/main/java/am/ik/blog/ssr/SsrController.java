package am.ik.blog.ssr;

import java.util.List;
import java.util.Map;

import am.ik.blog.entry.EntryClient;
import am.ik.blog.model.Entry;
import am.ik.blog.post.Post;
import am.ik.blog.post.PostClient;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class SsrController {

	private final ReactRenderer reactRenderer;

	private final EntryClient entryClient;

	private final PostClient postClient;

	public SsrController(ReactRenderer reactRenderer, EntryClient entryClient, PostClient postClient) {
		this.reactRenderer = reactRenderer;
		this.entryClient = entryClient;
		this.postClient = postClient;
	}

	@GetMapping(path = { "/", "/posts" })
	public String index() {
		List<Post> posts = this.postClient.getPosts();
		return this.reactRenderer.render("/", Map.of("preLoadedPosts", posts));
	}

	@GetMapping(path = { "/posts/{id}" })
	public String post(@PathVariable int id) {
		Post post = this.postClient.getPost(id);
		return this.reactRenderer.render("/posts/%d".formatted(id), Map.of("preLoadedPost", post));
	}

	@GetMapping(path = { "/entries/{entryId}" })
	public String post(@PathVariable long entryId) {
		Entry entry = this.entryClient.getEntry(entryId)
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, entryId + " is not found."));
		return this.reactRenderer.render("/entries/%d".formatted(entryId), Map.of("preLoadedEntry", entry));
	}

}
