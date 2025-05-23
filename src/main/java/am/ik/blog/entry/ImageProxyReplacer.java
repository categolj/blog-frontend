package am.ik.blog.entry;

import java.util.Objects;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import am.ik.blog.ImageProxyProps;
import am.ik.blog.entry.model.Entry;

import org.springframework.stereotype.Component;

@Component
public class ImageProxyReplacer {

	private final ImageProxyProps proxyProps;

	static final Pattern assetsPattern = Pattern.compile(
			"https://github.com/([a-z-A-Z-0-9.\\-_]+/?[a-z-A-Z-0-9.\\-_]+/assets/[a-z-A-Z-0-9.\\-_]+/?[a-z-A-Z-0-9.\\-_]+)",
			Pattern.DOTALL | Pattern.CASE_INSENSITIVE);

	public ImageProxyReplacer(ImageProxyProps proxyProps) {
		this.proxyProps = proxyProps;
	}

	public Entry replaceImage(Entry entry) {
		String content = Objects.requireNonNull(entry).getContent();
		Matcher assetMatcher = assetsPattern.matcher(content);
		return entry
			.content(assetMatcher.replaceAll(result -> "%s/%s".formatted(this.proxyProps.url(), result.group(1))));
	}

}
