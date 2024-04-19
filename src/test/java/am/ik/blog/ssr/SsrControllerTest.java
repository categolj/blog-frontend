package am.ik.blog.ssr;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

import am.ik.blog.entry.EntryClient;
import am.ik.blog.model.Author;
import am.ik.blog.model.Category;
import am.ik.blog.model.Entry;
import am.ik.blog.model.Tag;
import am.ik.pagination.CursorPage;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.MockMvc;

import static am.ik.blog.model.AuthorBuilder.author;
import static am.ik.blog.model.EntryBuilder.entry;
import static am.ik.blog.model.FrontMatterBuilder.frontMatter;
import static io.github.ulfs.assertj.jsoup.Assertions.assertThatDocument;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = SsrController.class, properties = "logging.level.am.ik.blog=trace")
@Import(ReactRenderer.class)
class SsrControllerTest {

	@Autowired
	MockMvc mvc;

	@MockBean
	EntryClient entryClient;

	Author author = author().name("demo").date(OffsetDateTime.parse("2024-04-01T00:00:00Z")).build();

	Entry entry100 = entry() //
		.entryId(100L) //
		.content("""
				Welcome
				**Hello world**, this is my first blog post.
				I hope you like it!
				""".trim()) //
		.created(author) //
		.updated(author) //
		.frontMatter(frontMatter() //
			.title("Hello World!") //
			.tags(List.of(new Tag("x"), new Tag("y"), new Tag("z"))) //
			.categories(List.of(new Category("a"), new Category("b"), new Category("c"))) //
			.build()) //
		.build();

	@Test
	void getEntry() throws Exception {
		given(this.entryClient.getEntry(100L)).willReturn(ResponseEntity.ok(entry100));

		String body = this.mvc.perform(get("/entries/100"))
			.andExpect(status().isOk())
			.andReturn()
			.getResponse()
			.getContentAsString();

		assertThatDocument(body) //
			.elementHasText("#title > a", "Hello World!") //
			.elementAttributeHasText("#title > a", "href", "/entries/100") //
			.elementHasText("#entry", "Welcome Hello world, this is my first blog post. I hope you like it!") //
			.elementHasText("#entry strong", "Hello world") //
			.elementHasHtml("#__INIT_DATA__",
					"""
							{"preLoadedEntry":{"entryId":100,"frontMatter":{"title":"Hello World!","categories":[{"name":"a"},{"name":"b"},{"name":"c"}],"tags":[{"name":"x"},{"name":"y"},{"name":"z"}]},"content":"Welcome\\n**Hello world**, this is my first blog post.\\nI hope you like it!","created":{"name":"demo","date":"2024-04-01T00:00:00Z"},"updated":{"name":"demo","date":"2024-04-01T00:00:00Z"}}}
							"""
						.trim());
	}

	@Test
	void getEntries() throws Exception {
		Entry entry2 = entry() //
			.entryId(2L) //
			.frontMatter(frontMatter() //
				.title("entry2") //
				.build()) //
			.build();
		Entry entry1 = entry() //
			.entryId(1L) //
			.frontMatter(frontMatter() //
				.title("entry1") //
				.build()) //
			.build();
		given(this.entryClient.getEntries(any()))
			.willReturn(ResponseEntity.ok(new CursorPage<>(List.of(entry2, entry1), 2, Entry::toCursor, false, true)));

		String body = this.mvc.perform(get("/entries"))
			.andExpect(status().isOk())
			.andReturn()
			.getResponse()
			.getContentAsString();

		assertThatDocument(body) //
			.elementHasText("#entries li:nth-child(1)", "entry2")
			.elementAttributeHasText("#entries li:nth-child(1) > a", "href", "/entries/2")
			.elementHasText("#entries li:nth-child(2)", "entry1")
			.elementAttributeHasText("#entries li:nth-child(2) > a", "href", "/entries/1")
			.elementHasHtml("#__INIT_DATA__",
					"""
							{"preLoadedEntries":{"content":[{"entryId":2,"frontMatter":{"title":"entry2","categories":null,"tags":null},"content":null,"created":null,"updated":null},{"entryId":1,"frontMatter":{"title":"entry1","categories":null,"tags":null},"content":null,"created":null,"updated":null}],"size":2,"hasPrevious":false,"hasNext":true}}
							"""
						.trim());
	}

	@Test
	void concurrentAccess() throws Exception {
		given(this.entryClient.getEntry(100L)).willReturn(ResponseEntity.ok(entry100));
		int n = 32;
		CountDownLatch latch;
		try (ExecutorService executorService = Executors.newFixedThreadPool(n)) {
			latch = new CountDownLatch(n);
			for (int i = 0; i < n; i++) {
				executorService.submit(() -> {
					try {
						this.mvc.perform(get("/entries/100")).andExpect(status().isOk());
					}
					catch (Exception e) {
						throw new RuntimeException(e);
					}
					latch.countDown();
				});
			}
		}
		boolean awaited = latch.await(30, TimeUnit.SECONDS);
		assertThat(awaited).isTrue();
	}

}