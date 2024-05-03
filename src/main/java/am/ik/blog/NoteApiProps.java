package am.ik.blog;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "note-api")
public record NoteApiProps(String url) {
}
