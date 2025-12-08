package am.ik.blog.llms;

import am.ik.blog.entry.EntryClient;
import am.ik.blog.entry.EntryRequest;
import am.ik.blog.entry.model.Entry;
import jakarta.annotation.Nullable;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import static am.ik.blog.entry.EntryRequestBuilder.entryRequest;

@RestController
public class LlmsController {

	private final EntryClient entryClient;

	public LlmsController(EntryClient entryClient) {
		this.entryClient = entryClient;
	}

	@GetMapping(path = "/llms.txt", produces = "text/plain")
	public String llms() {
		var responseJa = this.entryClient.getEntries(entryRequest().build(), null);
		var responseEn = this.entryClient.getEntries(entryRequest().build(), "en");
		String entriesJa = Objects.requireNonNull(responseJa.getBody(), "response body must not be null")
			.content()
			.stream()
			.map(entry -> """
					- [%s](/entries/%d.md) - 最終更新時刻 %s
					""".formatted(entry.frontMatter().title(), entry.entryKey().entryId(), entry.updated().date())
				.trim())
			.collect(Collectors.joining("\n"));
		String entriesEn = Objects.requireNonNull(responseEn.getBody(), "response body must not be null")
			.content()
			.stream()
			.map(entry -> """
					- [%s](/entries/%d/en.md) - Last Updated at %s
					""".formatted(entry.frontMatter().title(), entry.entryKey().entryId(), entry.updated().date())
				.trim())
			.collect(Collectors.joining("\n"));
		return """
				# IK.AM
				IK.AMは@makingの技術ブログです。

				## ナビゲーション
				- [記事一覧](/entries.md): Markdown形式の記事一覧
				- [記事一覧 (English)](/entries/en.md): Markdown形式の記事一覧
				- [記事ページ](/entries/[entryId].md): `entryId`に対応するMarkdown形式の記事ページ
				- [記事ページ (English)](/entries/[entryId]/en.md): `entryId`に対応する英語に翻訳されたMarkdown形式の記事ページ。ただし、未翻訳の場合は404エラーになります。

				## 最新の記事 (日本語版)
				%s

				## Latest Entries (English)
				%s
				"""
			.formatted(entriesJa, entriesEn);
	}

	@GetMapping(path = { "/entries.md", "/entries/{tenantId:[a-z]+}.md" }, produces = "text/plain")
	public String entries(EntryRequest request, @Nullable @PathVariable(required = false) String tenantId) {
		var response = this.entryClient.getEntries(request, tenantId);
		List<Entry> content = Objects.requireNonNull(response.getBody(), "response body must not be null").content();
		String entries = content.stream()
			.map(entry -> """
					- [%s](/entries/%d%s.md) - Last Updated at %s
					"""
				.formatted(entry.frontMatter().title(), entry.entryKey().entryId(),
						tenantId == null ? "" : "/" + tenantId, entry.updated().date())
				.trim())
			.collect(Collectors.joining("\n"));
		String more = "/entries" + (tenantId == null ? "" : "/" + tenantId) + ".md?cursor="
				+ content.getLast().updated().date();
		return """
				# IK.AM
				## Entries

				%s

				[More Entries](%s)
				""".formatted(entries, more);
	}

	@GetMapping(path = { "/entries/{entryId:[0-9]+}.md", "/entries/{entryId:[0-9]+}/{tenantId:[a-z]+}.md" },
			produces = "text/plain")
	public String entry(@PathVariable long entryId, @Nullable @PathVariable(required = false) String tenantId) {
		return Objects.requireNonNull(this.entryClient.getEntryAsMarkdown(entryId, tenantId).getBody(),
				"response body must not be null");
	}

}
