package am.ik.blog.counter;

import java.util.Locale;

import am.ik.blog.CounterApiProps;
import jakarta.annotation.Nullable;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.HttpHeaders;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@RestController
public class CounterController {

	private final CounterClient counterClient;

	private final CounterApiProps props;

	public CounterController(CounterClient counterClient, CounterApiProps props) {
		this.counterClient = counterClient;
		this.props = props;
	}

	@PostMapping(path = "/api/counter")
	public Counter postCounter(@RequestBody IncrementRequest request,
			@RequestHeader(name = HttpHeaders.USER_AGENT) String userAgent) {
		if (userAgent.toLowerCase(Locale.ROOT).contains("bot")) {
			return new Counter(0);
		}
		String ipAddress = getIpAddress();
		if (!CollectionUtils.isEmpty(props.ipBlackList()) && ipAddress != null) {
			if (props.ipBlackList().contains(ipAddress)) {
				return new Counter(0);
			}
		}
		return this.counterClient.increment(request);
	}

	@Nullable
	static String getIpAddress() {
		RequestAttributes requestAttributes = RequestContextHolder.getRequestAttributes();
		if (!(requestAttributes instanceof ServletRequestAttributes)) {
			return null;
		}
		HttpServletRequest request = ((ServletRequestAttributes) requestAttributes).getRequest();
		String xForwardedFor = request.getHeader("X-Forwarded-For");
		if (xForwardedFor != null) {
			return xForwardedFor;
		}
		return request.getRemoteAddr();
	}

}
