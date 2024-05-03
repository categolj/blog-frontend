package am.ik.blog.note;

import java.io.IOException;
import java.util.Arrays;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpRequest;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class NoteTokenInterceptor implements ClientHttpRequestInterceptor, HandlerInterceptor {

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws Exception {
		Cookie[] cookies = request.getCookies();
		if (cookies != null) {
			Arrays.stream(cookies)
				.filter(cookie -> NoteToken.COOKIE_NAME.equals(cookie.getName()))
				.findAny()
				.ifPresent(cookie -> RequestContextHolder.currentRequestAttributes()
					.setAttribute(NoteToken.COOKIE_NAME, cookie.getValue(), RequestAttributes.SCOPE_REQUEST));
		}
		return true;
	}

	@Override
	public ClientHttpResponse intercept(HttpRequest request, byte[] body, ClientHttpRequestExecution execution)
			throws IOException {
		Object token = RequestContextHolder.currentRequestAttributes()
			.getAttribute(NoteToken.COOKIE_NAME, RequestAttributes.SCOPE_REQUEST);
		if (token != null) {
			request.getHeaders().add(HttpHeaders.AUTHORIZATION, "Bearer " + token);
		}
		return execution.execute(request, body);
	}

}
