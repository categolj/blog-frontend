package am.ik.blog.execption;

import am.ik.blog.ssr.ReactRenderer;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

@ControllerAdvice
@Order(-1)
public class ExceptionHandlerControllerAdvice {

	private final ReactRenderer reactRenderer;

	public ExceptionHandlerControllerAdvice(ReactRenderer reactRenderer) {
		this.reactRenderer = reactRenderer;
	}

	@ExceptionHandler(RestClientResponseException.class)
	public ResponseEntity<?> handleRestClientResponseException(RestClientResponseException e) {
		if (e.getStatusCode() == HttpStatus.UNAUTHORIZED && e.getResponseHeaders() != null) {
			String wwwAuthenticate = e.getResponseHeaders().getFirst(HttpHeaders.WWW_AUTHENTICATE);
			if (wwwAuthenticate != null
					&& (wwwAuthenticate.startsWith("Bearer ") || wwwAuthenticate.startsWith("bearer "))) {
				String error = wwwAuthenticate.substring(7);
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(parseLogfmt(error));
			}
		}
		return ResponseEntity.status(e.getStatusCode()).body(e.getResponseBodyAs(String.class));
	}

	@ExceptionHandler(NoResourceFoundException.class)
	public ResponseEntity<String> handleResourceNotFound() {
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(this.reactRenderer.render("/notfound", Map.of()));
	}

	private static final Pattern LOGFMT_PATTERN = Pattern.compile("(\\w+)=\"([^\"]*)\"|(\\w+)=([^\\s]*)");

	public static Map<String, String> parseLogfmt(String logfmt) {
		LinkedHashMap<String, String> result = new LinkedHashMap<>();
		Matcher matcher = LOGFMT_PATTERN.matcher(logfmt);
		while (matcher.find()) {
			String key, value;
			if (matcher.group(1) != null) {
				key = matcher.group(1);
				value = matcher.group(2);
			}
			else {
				key = matcher.group(3);
				value = matcher.group(4);
			}
			result.put(key, value);
		}
		return result;
	}

}
