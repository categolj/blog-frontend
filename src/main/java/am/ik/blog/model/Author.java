package am.ik.blog.model;

import java.time.OffsetDateTime;

import jakarta.annotation.Nullable;
import org.jilt.Builder;

@Builder(toBuilder = "from")
public record Author(String name, @Nullable OffsetDateTime date) {
}
