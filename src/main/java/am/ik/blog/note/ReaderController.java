package am.ik.blog.note;

import java.util.UUID;

import am.ik.note.api.ReaderApi;
import am.ik.note.model.ActivationLinkId;
import am.ik.note.model.CreateReaderInput;
import am.ik.note.model.ReaderId;
import am.ik.note.model.ResponseMessage;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ReaderController {

	private final ReaderApi readerApi;

	public ReaderController(ReaderApi readerApi) {
		this.readerApi = readerApi;
	}

	@PostMapping(path = "/api/readers")
	public ResponseMessage createReader(@RequestBody CreateReaderInput input) {
		return this.readerApi.createReader(input);
	}

	@PostMapping(path = "/api/readers/{readerId}/activations/{activationLinkId}")
	public ResponseMessage activate(@PathVariable UUID readerId, @PathVariable UUID activationLinkId) {
		return this.readerApi.activate(new ReaderId().readerId(readerId),
				new ActivationLinkId().activationLinkId(activationLinkId));
	}

}
