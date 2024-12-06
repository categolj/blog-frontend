package am.ik.blog.comment;

import am.ik.blog.CommentApiProps;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClient;

@RestController
public class CommentController {

	private final RestClient restClient;

	public CommentController(RestClient.Builder restClientBuilder, CommentApiProps props) {
		this.restClient = restClientBuilder.baseUrl(props.url()).defaultStatusHandler(__ -> true, (req, res) -> {
		}).build();
	}

	@GetMapping(path = "/api/entries/{entryId}/comments")
	public ResponseEntity<?> getComments(@PathVariable Long entryId) {
		ResponseEntity<JsonNode> response = this.restClient.get()
			.uri("/entries/{entryId}/comments", entryId)
			.retrieve()
			.toEntity(JsonNode.class);
		return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
	}

	@PostMapping(path = "/api/entries/{entryId}/comments")
	public ResponseEntity<?> postComment(@PathVariable Long entryId, @RequestBody CommentRequest request,
			@AuthenticationPrincipal OidcUser user) {
		ResponseEntity<JsonNode> response = this.restClient.post()
			.uri("/entries/{entryId}/comments", entryId)
			.contentType(MediaType.APPLICATION_JSON)
			.headers(headers -> headers.setBearerAuth(user.getIdToken().getTokenValue()))
			.body(request)
			.retrieve()
			.toEntity(JsonNode.class);
		return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
	}

	@DeleteMapping(path = "/api/comments/{commentId}")
	public ResponseEntity<?> deleteComment(@PathVariable Long commentId, @AuthenticationPrincipal OidcUser user) {
		ResponseEntity<Void> response = this.restClient.delete()
			.uri("/comments/{commentId}", commentId)
			.headers(headers -> headers.setBearerAuth(user.getIdToken().getTokenValue()))
			.retrieve()
			.toBodilessEntity();
		return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
	}

	public record CommentRequest(String body) {
	}

}
