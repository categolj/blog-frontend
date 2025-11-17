package am.ik.blog.note.model;

import am.ik.blog.entry.model.Author;
import am.ik.blog.entry.model.FrontMatter;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

@JsonInclude(Include.NON_EMPTY)
public record NoteDetails(Long entryId, String content, FrontMatter frontMatter, String noteUrl, Author created,
		Author updated) {
}