package am.ik.blog.entry;

import java.util.Optional;

import am.ik.blog.model.Entry;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class EntryController {

	private final EntryClient entryClient;

	public EntryController(EntryClient entryClient) {
		this.entryClient = entryClient;
	}

	@GetMapping(path = "/api/entries/{entryId}")
	public Optional<Entry> getEntry(@PathVariable Long entryId) {
		return this.entryClient.getEntry(entryId);
	}

}
