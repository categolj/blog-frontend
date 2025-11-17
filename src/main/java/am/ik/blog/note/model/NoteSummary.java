package am.ik.blog.note.model;

import java.time.Instant;
import org.jspecify.annotations.Nullable;

public record NoteSummary(Long entryId, @Nullable String title, String noteUrl, boolean subscribed,
		@Nullable Instant updatedDate) {
}