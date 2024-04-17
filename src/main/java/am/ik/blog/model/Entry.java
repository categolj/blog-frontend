package am.ik.blog.model;

import java.time.Instant;
import java.util.Objects;

import org.jilt.Builder;

@Builder(toBuilder = "from")
public record Entry(Long entryId, FrontMatter frontMatter, String content, Author created, Author updated) {

	public Instant toCursor() {
		return Objects.requireNonNull(this.updated.date()).toInstant();
	}
}
