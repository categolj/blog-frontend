package am.ik.blog.entry;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import java.util.Objects;
import java.util.stream.Collectors;

import am.ik.blog.entry.model.CursorPageEntryInstant;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
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

	@GetMapping(path = { "/feed", "/rss" }, produces = MediaType.APPLICATION_RSS_XML_VALUE)
	public String feed(UriComponentsBuilder builder) {
		String baseUrl = builder.path("").build().toString();
		ResponseEntity<CursorPageEntryInstant> response = this.entryClient.getEntries(entryRequest().build());
		CursorPageEntryInstant page = Objects.requireNonNull(response.getBody());
		int size = Objects.requireNonNull(page.getSize());
		String items = size > 0 ? Objects.requireNonNull(page.getContent())
			.stream()
			.map(entry -> """
					<item>
						<title><![CDATA[%s]]></title>
						<link>%s/entries/%d</link>
						<guid isPermaLink="true">%s/entries/%d</guid>
						<pubDate>%s</pubDate>
					</item>
					""".formatted(entry.getFrontMatter().getTitle(), baseUrl, entry.getEntryId(), baseUrl,
					entry.getEntryId(), DATE_FORMATTER.format(Objects.requireNonNull(entry.getUpdated().getDate()))))
			.collect(Collectors.joining()) : "";
		String lastUpdatedDate = size > 0
				? DATE_FORMATTER.format(Objects
					.requireNonNull(Objects.requireNonNull(page.getContent()).getFirst().getUpdated().getDate()))
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
