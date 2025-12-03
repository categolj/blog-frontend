package am.ik.blog.security;

import java.io.IOException;
import java.util.List;
import java.util.regex.Pattern;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.http.HttpStatus;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Filter to silently block bot access to common spam paths. This filter matches request
 * URIs against configured regex patterns and returns 410 Gone for matches without logging
 * to reduce noise from automated bot scanning.
 */
public class BotBlockingFilter extends OncePerRequestFilter {

	private final List<Pattern> patterns;

	public BotBlockingFilter(List<String> patternStrings) {
		this.patterns = patternStrings.stream().map(Pattern::compile).toList();
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		String requestPath = request.getRequestURI();

		// Block paths matching configured patterns silently
		if (requestPath != null && patterns.stream().anyMatch(pattern -> pattern.matcher(requestPath).find())) {
			response.setStatus(HttpStatus.GONE.value());
			return;
		}

		filterChain.doFilter(request, response);
	}

}
