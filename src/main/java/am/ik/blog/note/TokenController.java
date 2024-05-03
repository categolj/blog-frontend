package am.ik.blog.note;

import java.time.Duration;

import am.ik.note.model.OAuth2Token;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TokenController {

	private final TokenClient tokenClient;

	public TokenController(TokenClient tokenClient) {
		this.tokenClient = tokenClient;
	}

	@PostMapping(path = "/api/token")
	public ResponseEntity<OAuth2Token> token(@RequestParam String username, @RequestParam String password) {
		OAuth2Token token = this.tokenClient.token(username, password);
		Long expiresIn = token.getExpiresIn();
		ResponseCookie cookie = ResponseCookie.from(NoteToken.COOKIE_NAME, token.getAccessToken())
			.path("/api")
			.sameSite("Strict")
			.httpOnly(true)
			.maxAge(Duration.ofSeconds(expiresIn))
			.build();
		return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString()).body(token);
	}

}
