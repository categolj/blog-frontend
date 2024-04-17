package am.ik.blog;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class BlogFrontendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BlogFrontendApplication.class, args);
	}

}
