package am.ik.blog.config;

import am.ik.blog.note.NoteTokenInterceptor;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration(proxyBeanMethods = false)
public class WebConfig implements WebMvcConfigurer {

	private final NoteTokenInterceptor noteTokenInterceptor;

	public WebConfig(NoteTokenInterceptor noteTokenInterceptor) {
		this.noteTokenInterceptor = noteTokenInterceptor;
	}

	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		registry.addInterceptor(noteTokenInterceptor).addPathPatterns("/api/**");
	}

}
