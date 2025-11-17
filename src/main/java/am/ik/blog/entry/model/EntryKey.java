package am.ik.blog.entry.model;

import java.util.Objects;
import org.jspecify.annotations.Nullable;
import org.springframework.util.Assert;

public record EntryKey(Long entryId, String tenantId) {

	public static String DEFAULT_TENANT_ID = "_";

	public EntryKey(Long entryId, @Nullable String tenantId) {
		this.entryId = entryId;
		this.tenantId = Objects.requireNonNullElse(tenantId, DEFAULT_TENANT_ID);
	}

	public EntryKey(Long entryId) {
		this(entryId, DEFAULT_TENANT_ID);
	}

	public static Builder builder() {
		return new Builder();
	}

	public Builder toBuilder() {
		return new Builder().entryId(this.entryId).tenantId(this.tenantId);
	}

	public static class Builder {

		private @Nullable Long entryId = null;

		private @Nullable String tenantId = null;

		private Builder() {
		}

		public Builder entryId(Long entryId) {
			this.entryId = entryId;
			return this;
		}

		public Builder tenantId(@Nullable String tenantId) {
			this.tenantId = tenantId;
			return this;
		}

		public EntryKey build() {
			Assert.notNull(entryId, "entryId is required");
			return new EntryKey(entryId, tenantId);
		}

	}

}