package am.ik.blog.entry;

import am.ik.blog.ImageProxyProps;
import am.ik.blog.entry.model.Author;
import am.ik.blog.entry.model.Entry;
import am.ik.blog.entry.model.EntryKey;
import am.ik.blog.entry.model.FrontMatter;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class ImageProxyReplacerTest {

	ImageProxyReplacer imageProxyReplacer = new ImageProxyReplacer(new ImageProxyProps("https://example.com"));

	@Test
	void replaceImageOldFormat() {
		Entry entry = Entry.builder()
			.content(
					"""
							<img width="1912" alt="image" src="https://github.com/making/blog.ik.am/assets/106908/2d4c7e0b-f34b-4375-801a-688816bb2de7">
							""")
			.entryKey(EntryKey.builder().entryId(1L).build())
			.frontMatter(FrontMatter.builder().title("Hello").build())
			.created(Author.builder().name("test").build())
			.updated(Author.builder().name("test").build())
			.build();
		Entry replaced = this.imageProxyReplacer.replaceImage(entry);
		assertThat(replaced.content()).isEqualToIgnoringNewLines(
				"""
						<img width="1912" alt="image" src="https://example.com/making/blog.ik.am/assets/106908/2d4c7e0b-f34b-4375-801a-688816bb2de7">
						""");
	}

	@Test
	void replaceImageNewFormat() {
		Entry entry = Entry.builder()
			.content(
					"""
							<img width="710" alt="image" src="https://github.com/user-attachments/assets/9ebb404a-db44-43b4-bfba-cb4b25edbeec">
							""")
			.entryKey(EntryKey.builder().entryId(1L).build())
			.frontMatter(FrontMatter.builder().title("Hello").build())
			.created(Author.builder().name("test").build())
			.updated(Author.builder().name("test").build())
			.build();
		Entry replaced = this.imageProxyReplacer.replaceImage(entry);
		assertThat(replaced.content()).isEqualToIgnoringNewLines(
				"""
						<img width="710" alt="image" src="https://example.com/user-attachments/assets/9ebb404a-db44-43b4-bfba-cb4b25edbeec">
						""");
	}

}