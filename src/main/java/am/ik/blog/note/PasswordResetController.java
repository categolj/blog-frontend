package am.ik.blog.note;

import am.ik.blog.note.model.PasswordResetInput;
import am.ik.blog.note.model.ResponseMessage;
import am.ik.blog.note.model.SendLinkInput;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PasswordResetController {

	private final NoteClient noteClient;

	public PasswordResetController(NoteClient noteClient) {
		this.noteClient = noteClient;
	}

	@PostMapping(path = "/api/password_reset/send_link")
	public ResponseMessage sendLink(@RequestBody SendLinkInput input) {
		return this.noteClient.sendPasswordResetLink(input);
	}

	@PostMapping(path = "/api/password_reset")
	public ResponseMessage reset(@RequestBody PasswordResetInput input) {
		return this.noteClient.resetPassword(input);
	}

}
