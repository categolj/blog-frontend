package am.ik.blog.ratelimit;

import java.io.IOException;
import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Simple in-memory rate limiting filter based on IP address. Uses a sliding window
 * approach to limit requests per IP within a configurable time window.
 */
public class RateLimitFilter extends OncePerRequestFilter {

	private static final Logger log = LoggerFactory.getLogger(RateLimitFilter.class);

	private final ConcurrentHashMap<String, RequestCounter> requestCounts = new ConcurrentHashMap<>();

	private final int maxRequests;

	private final long windowSizeMillis;

	public RateLimitFilter(int maxRequests, long windowSizeMillis) {
		this.maxRequests = maxRequests;
		this.windowSizeMillis = windowSizeMillis;
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		String clientIp = getClientIp(request);
		long now = Instant.now().toEpochMilli();

		RequestCounter counter = requestCounts.compute(clientIp, (ip, existing) -> {
			if (existing == null || existing.isExpired(now, windowSizeMillis)) {
				return new RequestCounter(now);
			}
			return existing;
		});

		int currentCount = counter.incrementAndGet();

		if (currentCount > maxRequests) {
			log.warn("Rate limit exceeded for IP: {} (count: {}, limit: {})", clientIp, currentCount, maxRequests);
			response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
			response.setContentType("application/json");
			response.getWriter().write("{\"error\":\"Too many requests. Please try again later.\"}");
			return;
		}

		filterChain.doFilter(request, response);
	}

	private String getClientIp(HttpServletRequest request) {
		// Check X-Forwarded-For header for proxied requests
		String xForwardedFor = request.getHeader("X-Forwarded-For");
		if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
			// Take the first IP in the chain (original client)
			return xForwardedFor.split(",")[0].trim();
		}
		// Check X-Real-IP header
		String xRealIp = request.getHeader("X-Real-IP");
		if (xRealIp != null && !xRealIp.isEmpty()) {
			return xRealIp.trim();
		}
		return request.getRemoteAddr();
	}

	@Scheduled(fixedRateString = "${rate-limit.window:60000}")
	public void cleanupExpiredEntries() {
		long now = Instant.now().toEpochMilli();
		requestCounts.entrySet().removeIf(entry -> entry.getValue().isExpired(now, windowSizeMillis));
	}

	private static class RequestCounter {

		private final long windowStart;

		private final AtomicInteger count;

		RequestCounter(long windowStart) {
			this.windowStart = windowStart;
			this.count = new AtomicInteger(0);
		}

		int incrementAndGet() {
			return count.incrementAndGet();
		}

		boolean isExpired(long now, long windowSizeMillis) {
			return now - windowStart > windowSizeMillis;
		}

	}

}
