package am.ik.blog;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "counter-api")
public record CounterApiProps(String url) {
}
