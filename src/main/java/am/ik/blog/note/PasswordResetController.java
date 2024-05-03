package am.ik.blog.note;

import am.ik.note.api.PasswordResetApi;
import am.ik.note.model.PasswordResetInput;
import am.ik.note.model.ResponseMessage;
import am.ik.note.model.SendLinkInput;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PasswordResetController {

	private final PasswordResetApi passwordResetApi;

	public PasswordResetController(PasswordResetApi passwordResetApi) {
		this.passwordResetApi = passwordResetApi;
	}

	@PostMapping(path = "/api/password_reset/send_link")
	public ResponseMessage sendLink(@RequestBody SendLinkInput input) {
		return this.passwordResetApi.sendLink(input);
	}

	@PostMapping(path = "/api/password_reset")
	public ResponseMessage reset(@RequestBody PasswordResetInput input) {
		return this.passwordResetApi.reset(input);
	}

}
