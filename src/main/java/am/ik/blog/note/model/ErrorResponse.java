package am.ik.blog.note.model;

import org.jspecify.annotations.NonNull;

public record ErrorResponse(@NonNull String message, @NonNull String noteUrl) {
}
