package am.ik.blog.model;

import org.jilt.Builder;

@Builder(toBuilder = "from")
public record Entry(Long entryId, FrontMatter frontMatter, String content, Author created, Author updated) {

}
