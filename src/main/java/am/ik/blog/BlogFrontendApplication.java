package am.ik.blog;

import java.time.Instant;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@ConfigurationPropertiesScan
@EnableScheduling
public class BlogFrontendApplication {

	public static void main(String[] args) {
		System.setProperty("info.env.launch", Instant.now().toString());
		SpringApplication.run(BlogFrontendApplication.class, args);
	}

}
