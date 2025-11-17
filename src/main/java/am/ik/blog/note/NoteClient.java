package am.ik.blog.note;

import am.ik.blog.NoteApiProps;
import am.ik.blog.note.model.CreateReaderInput;
import am.ik.blog.note.model.NoteDetails;
import am.ik.blog.note.model.NoteSummary;
import am.ik.blog.note.model.OAuth2Token;
import am.ik.blog.note.model.PasswordResetInput;
import am.ik.blog.note.model.ResponseMessage;
import am.ik.blog.note.model.SendLinkInput;
import am.ik.blog.note.model.SubscribeOutput;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.client.RestClient;

@Component
public class NoteClient {

	private final RestClient restClient;

	public NoteClient(RestClient.Builder restClientBuilder, NoteApiProps props,
			NoteTokenInterceptor noteTokenInterceptor) {
		this.restClient = restClientBuilder.baseUrl(props.url()).requestInterceptor(noteTokenInterceptor).build();
	}

	public OAuth2Token token(String username, String password) {
		return Objects.requireNonNull(this.restClient.post()
			.uri("/oauth/token")
			.contentType(MediaType.APPLICATION_FORM_URLENCODED)
			.body(new LinkedMultiValueMap<>(Map.of("username", List.of(username), "password", List.of(password))))
			.retrieve()
			.body(OAuth2Token.class));
	}

	public List<NoteSummary> getNotes() {
		return Objects
			.requireNonNull(this.restClient.get().uri("/notes").retrieve().body(new ParameterizedTypeReference<>() {
			}));
	}

	public NoteDetails getNoteByEntryId(Long entryId) {
		return Objects
			.requireNonNull(this.restClient.get().uri("/notes/{entryId}", entryId).retrieve().body(NoteDetails.class));
	}

	public SubscribeOutput subscribe(UUID noteId) {
		return Objects.requireNonNull(
				this.restClient.post().uri("/notes/{noteId}/subscribe", noteId).retrieve().body(SubscribeOutput.class));
	}

	public ResponseMessage createReader(CreateReaderInput input) {
		return Objects
			.requireNonNull(this.restClient.post().uri("/readers").body(input).retrieve().body(ResponseMessage.class));
	}

	public ResponseMessage activateReader(UUID readerId, UUID activationLinkId) {
		return Objects.requireNonNull(this.restClient.post()
			.uri("/readers/{readerId}/activations/{activationLinkId}", readerId, activationLinkId)
			.retrieve()
			.body(ResponseMessage.class));
	}

	public ResponseMessage sendPasswordResetLink(SendLinkInput input) {
		return Objects.requireNonNull(this.restClient.post()
			.uri("/password_reset/send_link")
			.body(input)
			.retrieve()
			.body(ResponseMessage.class));
	}

	public ResponseMessage resetPassword(PasswordResetInput input) {
		return Objects.requireNonNull(
				this.restClient.post().uri("/password_reset").body(input).retrieve().body(ResponseMessage.class));
	}

}
