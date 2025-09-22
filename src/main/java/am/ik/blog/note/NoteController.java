package am.ik.blog.note;

import am.ik.blog.note.model.NoteDetails;
import am.ik.blog.note.model.NoteSummary;
import am.ik.blog.note.model.SubscribeOutput;
import java.util.List;
import java.util.UUID;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class NoteController {

	private final NoteClient noteClient;

	public NoteController(NoteClient noteClient) {
		this.noteClient = noteClient;
	}

	@GetMapping(path = "/api/notes")
	public List<NoteSummary> getNotes() {
		return this.noteClient.getNotes();
	}

	@GetMapping(path = "/api/notes/{entryId:[0-9]+}")
	public NoteDetails getNote(@PathVariable Long entryId) {
		return this.noteClient.getNoteByEntryId(entryId);
	}

	@PostMapping(path = "/api/notes/{noteId}/subscribe")
	public SubscribeOutput subscribe(@PathVariable UUID noteId) {
		return this.noteClient.subscribe(noteId);
	}

}
