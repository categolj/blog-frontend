package am.ik.blog.entry.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.jspecify.annotations.Nullable;
import org.springframework.util.Assert;

public record Tag(String name, @Nullable @JsonInclude(JsonInclude.Include.NON_EMPTY) String version) {

	public Tag(String name) {
		this(name, null);
	}

	public static Builder builder() {
		return new Builder();
	}

	public Builder toBuilder() {
		return new Builder().name(this.name).version(this.version);
	}

	public static class Builder {

		private @Nullable String name;

		private @Nullable String version;

		private Builder() {
		}

		public Builder name(String name) {
			this.name = name;
			return this;
		}

		public Builder version(@Nullable String version) {
			this.version = version;
			return this;
		}

		public Tag build() {
			Assert.hasText(name, "name is required");
			return new Tag(name, version);
		}

	}
}
