package am.ik.blog.google;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;

@RestController
public class GoogleController {

	@GetMapping(path = "/api/google/login", params = "redirect_path")
	public ResponseEntity<Void> login(@RequestParam(name = "redirect_path") String redirectPath,
			@RequestHeader(name = HttpHeaders.REFERER, required = false) URI referer,
			UriComponentsBuilder uriComponentsBuilder) {
		if (!redirectPath.startsWith("/")) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "'redirectPath' must start with '/'");
		}
		UriComponents uriComponents = uriComponentsBuilder.path(redirectPath).build();
		String location;
		int port = referer.getPort();
		if (isViteDevPort(port)) {
			// behind the vite proxy in the dev-mode
			location = UriComponentsBuilder.fromUriString(uriComponents.toUriString()).port(port).toUriString();
		}
		else {
			location = uriComponents.toUriString();
		}
		return ResponseEntity.status(HttpStatus.SEE_OTHER).header(HttpHeaders.LOCATION, location).build();
	}

	@GetMapping(path = "/api/google/whoami")
	public LoginUser whoami(@AuthenticationPrincipal Object principal, CsrfToken csrfToken) {
		if (principal instanceof OidcUser user) {
			return new GoogleUser(user.getSubject(), user.getFullName(), user.getEmail(), user.getPicture(),
					csrfToken.getToken());
		}
		else {
			return new AnonymousUser();
		}
	}

	public sealed interface LoginUser permits AnonymousUser, GoogleUser {

	}

	record AnonymousUser() implements LoginUser {
	}

	record GoogleUser(String id, String name, String email, String picture, String csrfToken) implements LoginUser {
	}

	static boolean isViteDevPort(int port) {
		return port >= 5170 && port <= 5179;
	}

}
