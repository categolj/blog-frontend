package am.ik.blog.note.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.Set;

public record OAuth2Token(@JsonProperty("access_token") String accessToken,
		@JsonProperty("token_type") String tokenType, @JsonProperty("expires_in") long expiresIn, Set<String> scope) {

}