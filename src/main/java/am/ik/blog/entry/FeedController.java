package am.ik.blog.entry;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import java.util.Objects;
import java.util.stream.Collectors;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

import static am.ik.blog.entry.EntryRequestBuilder.entryRequest;

@RestController
public class FeedController {

	private final EntryClient entryClient;

	private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter
		.ofPattern("EEE, dd MMM yyyy HH:mm:ss zzz", Locale.US)
		.withZone(ZoneId.of("GMT"));

	public FeedController(EntryClient entryClient) {
		this.entryClient = entryClient;
	}

	@GetMapping(path = { "/feed", "/feed/", "/rss", "/rss/", "/feed/{tenantId:[a-z]+}", "/rss/{tenantId:[a-z]+}" },
			produces = MediaType.APPLICATION_XML_VALUE)
	public String feed(UriComponentsBuilder builder, @PathVariable(required = false) String tenantId) {
		String baseUrl = builder.path("").build() + (tenantId == null ? "" : "/tenants/" + tenantId);
		var response = this.entryClient.getEntries(entryRequest().build(), tenantId);
		var page = Objects.requireNonNull(response.getBody());
		int size = page.size();
		String items = size > 0 ? page.content().stream().map(entry -> {
			String summary = entry.frontMatter().summary();
			String description = summary.isEmpty() ? ""
					: "\n\t\t\t<description><![CDATA[%s]]></description>".formatted(summary);
			return """
					<item>
						<title><![CDATA[%s]]></title>
						<link>%s/entries/%d</link>
						<guid isPermaLink="true">%s/entries/%d</guid>
						<pubDate>%s</pubDate>%s
					</item>
					""".formatted(entry.frontMatter().title(), baseUrl, entry.entryKey().entryId(), baseUrl,
					entry.entryKey().entryId(), DATE_FORMATTER.format(Objects.requireNonNull(entry.updated().date())),
					description);
		}).collect(Collectors.joining()) : "";
		String lastUpdatedDate = size > 0
				? DATE_FORMATTER
					.format(Objects.requireNonNull(Objects.requireNonNull(page.content()).getFirst().updated().date()))
				: Instant.ofEpochMilli(0).toString();
		return """
				<?xml version="1.0" encoding="UTF-8"?><rss   xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
				    <channel>
				        <title><![CDATA[IK.AM]]></title>
				        <description><![CDATA[@making's tech note]]></description>
				        <link>%s</link>
				        <lastBuildDate>%s</lastBuildDate>
				        <atom:link href="%s/feed" rel="self" type="application/rss+xml"/>
				        <language><![CDATA[ja]]></language>
				        %s
				    </channel>
				</rss>
				""".formatted(baseUrl, lastUpdatedDate, baseUrl, items);
	}

}
