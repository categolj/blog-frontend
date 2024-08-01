package am.ik.blog;

import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "counter-api")
public record CounterApiProps(String url, List<String> ipBlackList) {
}
