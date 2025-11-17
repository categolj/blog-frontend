package am.ik.blog.entry.model;

import org.jspecify.annotations.Nullable;
import org.springframework.util.Assert;

public record Category(String name) {

	// Used for deserialization in Jackson
	public static Category valueOf(String category) {
		return new Category(category);
	}

	public static Builder builder() {
		return new Builder();
	}

	public Builder toBuilder() {
		return new Builder().name(this.name);
	}

	public static class Builder {

		private @Nullable String name;

		private Builder() {
		}

		public Builder name(String name) {
			this.name = name;
			return this;
		}

		public Category build() {
			Assert.hasText(name, "name is required");
			return new Category(name);
		}

	}
}
