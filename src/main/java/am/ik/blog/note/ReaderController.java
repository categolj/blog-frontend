package am.ik.blog.note;

import am.ik.blog.note.model.CreateReaderInput;
import am.ik.blog.note.model.ResponseMessage;
import java.util.UUID;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ReaderController {

	private final NoteClient noteClient;

	public ReaderController(NoteClient noteClient) {
		this.noteClient = noteClient;
	}

	@PostMapping(path = "/api/readers")
	public ResponseMessage createReader(@RequestBody CreateReaderInput input) {
		return this.noteClient.createReader(input);
	}

	@PostMapping(path = "/api/readers/{readerId}/activations/{activationLinkId}")
	public ResponseMessage activate(@PathVariable UUID readerId, @PathVariable UUID activationLinkId) {
		return this.noteClient.activateReader(readerId, activationLinkId);
	}

}
