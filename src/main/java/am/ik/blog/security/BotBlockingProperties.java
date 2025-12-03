package am.ik.blog.security;

import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.bind.DefaultValue;

/**
 * Configuration properties for bot blocking filter. Allows specifying multiple regex
 * patterns to match against request URIs for blocking bot access.
 */
@ConfigurationProperties(prefix = "bot-blocking")
public record BotBlockingProperties(@DefaultValue( {
		"/wp-" }) List<String> patterns){
}
