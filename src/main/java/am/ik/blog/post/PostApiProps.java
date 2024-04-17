package am.ik.blog.post;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "post-api")
public record PostApiProps(String url) {
}
