package am.ik.blog.entry;

import am.ik.blog.ImageProxyProps;
import am.ik.blog.entry.model.Entry;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

class ImageProxyReplacerTest {

	ImageProxyReplacer imageProxyReplacer = new ImageProxyReplacer(new ImageProxyProps("https://example.com"));

	@Test
	void replaceImageOldFormat() {
		Entry entry = new Entry().content(
				"""
						<img width="1912" alt="image" src="https://github.com/making/blog.ik.am/assets/106908/2d4c7e0b-f34b-4375-801a-688816bb2de7">
						""");
		Entry replaced = this.imageProxyReplacer.replaceImage(entry);
		assertThat(replaced.getContent()).isEqualToIgnoringNewLines(
				"""
						<img width="1912" alt="image" src="https://example.com/making/blog.ik.am/assets/106908/2d4c7e0b-f34b-4375-801a-688816bb2de7">
						""");
	}

	@Test
	void replaceImageNewFormat() {
		Entry entry = new Entry().content(
				"""
						<img width="710" alt="image" src="https://github.com/user-attachments/assets/9ebb404a-db44-43b4-bfba-cb4b25edbeec">
						""");
		Entry replaced = this.imageProxyReplacer.replaceImage(entry);
		assertThat(replaced.getContent()).isEqualToIgnoringNewLines(
				"""
						<img width="710" alt="image" src="https://example.com/user-attachments/assets/9ebb404a-db44-43b4-bfba-cb4b25edbeec">
						""");
	}

}