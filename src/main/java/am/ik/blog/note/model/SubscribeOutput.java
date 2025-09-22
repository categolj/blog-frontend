package am.ik.blog.note.model;

import org.jspecify.annotations.NonNull;

public record SubscribeOutput(@NonNull Long entryId, @NonNull boolean subscribed) {

}