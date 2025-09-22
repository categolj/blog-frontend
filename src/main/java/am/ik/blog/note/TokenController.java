package am.ik.blog.note;

import am.ik.blog.note.model.OAuth2Token;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Base64;
import java.util.regex.Pattern;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TokenController {

	private final NoteClient noteClient;

	public TokenController(NoteClient noteClient) {
		this.noteClient = noteClient;
	}

	@GetMapping(path = "/api/me", produces = MediaType.APPLICATION_JSON_VALUE)
	public byte[] me(@RequestAttribute(name = NoteToken.COOKIE_NAME, required = false) String jwt) {
		if (jwt == null) {
			return """
					{"preferred_username":"anonymous"}
					""".getBytes(StandardCharsets.UTF_8);
		}
		return Base64.getDecoder().decode(jwt.split(Pattern.quote("."), 3)[1]);
	}

	@PostMapping(path = "/api/token")
	public ResponseEntity<OAuth2Token> token(@RequestParam String username, @RequestParam String password) {
		OAuth2Token token = this.noteClient.token(username, password);
		Long expiresIn = token.expiresIn();
		ResponseCookie cookie = cookie().value(token.accessToken()).maxAge(Duration.ofSeconds(expiresIn)).build();
		return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString()).body(token);
	}

	@DeleteMapping(path = "/api/token")
	public ResponseEntity<Void> deleteToken() {
		ResponseCookie cookie = cookie().maxAge(0).build();
		return ResponseEntity.noContent().header(HttpHeaders.SET_COOKIE, cookie.toString()).build();
	}

	private static ResponseCookie.ResponseCookieBuilder cookie() {
		return ResponseCookie.from(NoteToken.COOKIE_NAME).path("/api").sameSite("Strict").httpOnly(true);
	}

}
