package am.ik.blog.note.model;

import am.ik.blog.entry.model.Author;
import am.ik.blog.entry.model.FrontMatter;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import org.springframework.lang.NonNull;

@JsonInclude(Include.NON_EMPTY)
public record NoteDetails(@NonNull Long entryId, @NonNull String content, @NonNull FrontMatter frontMatter,
		@NonNull String noteUrl, Author created, @NonNull Author updated) {
}