package am.ik.blog.note.model;

import java.util.UUID;

public record PasswordResetInput(UUID resetId, String newPassword) {

}