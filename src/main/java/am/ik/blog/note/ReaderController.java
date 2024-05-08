package am.ik.blog.note;

import java.util.UUID;

import am.ik.blog.NoteApiProps;
import am.ik.note.api.ReaderApi;
import am.ik.note.model.CreateReaderInput;
import am.ik.note.model.ResponseMessage;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClient;

@RestController
public class ReaderController {

	private final ReaderApi readerApi;

	private final RestClient restClient;

	public ReaderController(ReaderApi readerApi, RestClient.Builder restClientBuilder,
			NoteTokenInterceptor noteTokenInterceptor, NoteApiProps props) {
		this.readerApi = readerApi;
		this.restClient = restClientBuilder.baseUrl(props.url()).requestInterceptor(noteTokenInterceptor).build();
	}

	@PostMapping(path = "/api/readers")
	public ResponseMessage createReader(@RequestBody CreateReaderInput input) {
		return this.readerApi.createReader(input);
	}

	@PostMapping(path = "/api/readers/{readerId}/activations/{activationLinkId}")
	public ResponseMessage activate(@PathVariable UUID readerId, @PathVariable UUID activationLinkId) {
		return this.restClient.post()
			.uri("/readers/{readerId}/activations/{activationLinkId}", readerId, activationLinkId)
			.retrieve()
			.body(ResponseMessage.class);
	}

}
