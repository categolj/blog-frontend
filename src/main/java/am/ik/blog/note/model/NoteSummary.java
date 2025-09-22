package am.ik.blog.note.model;

import java.time.Instant;
import org.jspecify.annotations.NonNull;
import org.jspecify.annotations.Nullable;

public record NoteSummary(@NonNull Long entryId, @Nullable String title, @NonNull String noteUrl, boolean subscribed,
		@Nullable Instant updatedDate) {
}