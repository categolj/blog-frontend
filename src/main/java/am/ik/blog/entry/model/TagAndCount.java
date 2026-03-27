package am.ik.blog.entry.model;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.annotation.JsonUnwrapped;
import org.jspecify.annotations.Nullable;
import org.springframework.util.Assert;

@JsonPropertyOrder({ "name", "count" })
public record TagAndCount(@JsonUnwrapped Tag tag, int count) {

	public static Builder builder() {
		return new Builder();
	}

	public Builder toBuilder() {
		return new Builder().tag(this.tag).count(this.count);
	}

	public static class Builder {

		private @Nullable Tag tag;

		private int count;

		private Builder() {
		}

		public Builder tag(Tag tag) {
			this.tag = tag;
			return this;
		}

		public Builder count(int count) {
			this.count = count;
			return this;
		}

		public TagAndCount build() {
			Assert.notNull(tag, "tag is required");
			return new TagAndCount(tag, count);
		}

	}
}
