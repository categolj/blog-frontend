package am.ik.blog;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "translation-api")
public record TranslationApiProps(String url) {
}
