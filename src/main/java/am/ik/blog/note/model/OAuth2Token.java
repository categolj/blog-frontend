package am.ik.blog.note.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.Set;
import org.jspecify.annotations.NonNull;

public record OAuth2Token(@NonNull @JsonProperty("access_token") String accessToken,
		@NonNull @JsonProperty("token_type") String tokenType, @NonNull @JsonProperty("expires_in") long expiresIn,
		@NonNull Set<String> scope) {

}