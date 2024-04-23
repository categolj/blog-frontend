package am.ik.blog.entry;

import java.time.Instant;
import java.util.List;

import jakarta.annotation.Nullable;
import org.jilt.Builder;

import org.springframework.util.CollectionUtils;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.util.StringUtils;

@Builder(toBuilder = "from")
public record EntryRequest(@Nullable String query, @Nullable String tag, @Nullable List<String> categories,
		@Nullable Instant cursor, Integer size) {

	public MultiValueMap<String, String> toQueryParams() {
		var params = new LinkedMultiValueMap<String, String>();
		if (StringUtils.hasText(query)) {
			params.add("query", query);
		}
		if (StringUtils.hasText(tag)) {
			params.add("tag", tag);
		}
		if (!CollectionUtils.isEmpty(categories)) {
			params.addAll("categories", categories);
		}
		if (cursor != null) {
			params.add("cursor", cursor.toString());
		}
		if (size != null && size > 0) {
			params.add("size", String.valueOf(size));
		}
		return params;
	}
}
