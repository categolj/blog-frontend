package am.ik.blog.note;

import java.util.List;
import java.util.UUID;

import am.ik.note.api.NoteApi;
import am.ik.note.model.NoteDetails;
import am.ik.note.model.NoteId;
import am.ik.note.model.NoteSummary;
import am.ik.note.model.SubscribeOutput;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class NoteController {

	private final NoteApi noteApi;

	public NoteController(NoteApi noteApi) {
		this.noteApi = noteApi;
	}

	@GetMapping(path = "/api/notes")
	public List<NoteSummary> getNotes() {
		return this.noteApi.getNotes();
	}

	@GetMapping(path = "/api/notes/{entryId:[0-9]+}")
	public NoteDetails getNote(@PathVariable Long entryId) {
		return this.noteApi.getNoteByEntryId(entryId);
	}

	@PostMapping(path = "/api/notes/{noteId}/subscribe")
	public SubscribeOutput subscribe(@PathVariable UUID noteId) {
		return this.noteApi.subscribe(new NoteId().noteId(noteId));
	}

}
