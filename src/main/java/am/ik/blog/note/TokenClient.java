package am.ik.blog.note;

import java.util.List;
import java.util.Map;

import am.ik.blog.NoteApiProps;
import am.ik.note.model.OAuth2Token;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.client.RestClient;

@Component
public class TokenClient {

	private final RestClient restClient;

	public TokenClient(RestClient.Builder restClientBuilder, NoteApiProps props) {
		this.restClient = restClientBuilder.baseUrl(props.url()).build();
	}

	public OAuth2Token token(String username, String password) {
		return this.restClient.post()
			.uri("/oauth/token")
			.contentType(MediaType.APPLICATION_FORM_URLENCODED)
			.body(new LinkedMultiValueMap<>(Map.of("username", List.of(username), "password", List.of(password))))
			.retrieve()
			.body(OAuth2Token.class);
	}

}
