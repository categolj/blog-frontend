package am.ik.blog.ssr;

import am.ik.blog.Json;
import am.ik.blog.config.SecurityConfig;
import am.ik.blog.entry.EntryClient;
import am.ik.blog.entry.ImageProxyReplacer;
import am.ik.blog.entry.api.CategoryApi;
import am.ik.blog.entry.api.TagApi;
import am.ik.blog.entry.model.CursorPageEntryInstant;
import am.ik.blog.entry.model.Entry;
import com.fasterxml.jackson.core.type.TypeReference;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static io.github.ulfs.assertj.jsoup.Assertions.assertThatDocument;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = SsrController.class,
		properties = { "logging.level.am.ik.blog=trace", "logging.structured.format.console=" })
@Import({ ReactRenderer.class, SecurityConfig.class })
class SsrControllerTest {

	@Autowired
	MockMvc mvc;

	@MockitoBean
	EntryClient entryClient;

	@MockitoBean
	TagApi tagApi;

	@MockitoBean
	CategoryApi categoryApi;

	Entry entry100 = Json.parse("""
						{
			  "entryId": 100,
			  "frontMatter": {
			    "title": "Hello World!",
			    "categories": [
			      {
			        "name": "a"
			      },
			      {
			        "name": "b"
			      },
			      {
			        "name": "c"
			      }
			    ],
			    "tags": [
			      {
			        "name": "x",
			        "count": 1
			      },
			      {
			        "name": "y",
			        "count": 1
			      },
			      {
			        "name": "z",
			        "count": 1
			      }
			    ]
			  },
			  "content": "Welcome\\n**Hello world**, this is my first blog post.\\nI hope you like it!",
			  "created": {
			    "name": "demo",
			    "date": "2024-04-01T00:00:00Z"
			  },
			  "updated": {
			    "name": "demo",
			    "date": "2024-04-01T00:00:00Z"
			  }
			}
			""", new TypeReference<>() {
	});

	;

	@Test
	void getEntry() throws Exception {
		given(this.entryClient.getEntry(100L, null)).willReturn(ResponseEntity.ok(entry100));

		String body = this.mvc.perform(get("/entries/100"))
			.andExpect(status().isOk())
			.andReturn()
			.getResponse()
			.getContentAsString();

		assertThatDocument(body) //
			.elementHasText("#entry-title > a", "Hello World!") //
			.elementAttributeHasText("#entry-title > a", "href", "/entries/100") //
			.elementHasText("#entry", "Welcome Hello world, this is my first blog post. I hope you like it!") //
			.elementHasText("#entry strong", "Hello world") //
			.elementHasHtml("#__INIT_DATA__",
					"""
							{"preLoadedEntry":{"entryId":100,"frontMatter":{"title":"Hello World!","categories":[{"name":"a"},{"name":"b"},{"name":"c"}],"tags":[{"name":"x","version":null},{"name":"y","version":null},{"name":"z","version":null}]},"content":"Welcome\\n**Hello world**, this is my first blog post.\\nI hope you like it!","created":{"name":"demo","date":"2024-04-01T00:00:00Z"},"updated":{"name":"demo","date":"2024-04-01T00:00:00Z"}}}
							"""
						.trim());
	}

	@Test
	void getEntries() throws Exception {
		given(this.entryClient.getEntries(any(), any())).willReturn(ResponseEntity
			.ok(new CursorPageEntryInstant().size(2).hasNext(true).hasPrevious(false).content(Json.parse("""
					[
					  {
					    "entryId": 2,
					    "frontMatter": {
					      "title": "entry2",
					      "categories": [],
					      "tags": []
					    },
					    "content": "",
					    "created": {
					      "name": "demo",
					      "date": "2024-04-01T00:00:00Z"
					    },
					    "updated": {
					      "name": "demo",
					      "date": "2024-04-02T00:00:00Z"
					    }
					  },
					  {
					    "entryId": 1,
					    "frontMatter": {
					      "title": "entry1",
					      "categories": [],
					      "tags": []
					    },
					    "content": "",
					    "created": {
					      "name": "demo",
					      "date": "2024-04-01T00:00:00Z"
					    },
					    "updated": {
					      "name": "demo",
					      "date": "2024-04-01T00:00:00Z"
					    }
					  }
					]
					""", new TypeReference<>() {
			}))));

		String body = this.mvc.perform(get("/entries"))
			.andExpect(status().isOk())
			.andReturn()
			.getResponse()
			.getContentAsString();

		assertThatDocument(body) //
			.elementMatchesText("#entries > div:nth-child(1) > div.space-y-4 > div:nth-child(1)", "entry2 Apr 2, 2024")
			.elementAttributeHasText("#entries > div:nth-child(1) > div.space-y-4 > div:nth-child(1) > a", "href",
					"/entries/2")
			.elementMatchesText("#entries > div:nth-child(1) > div.space-y-4 > div:nth-child(2)", "entry1 Apr 1, 2024")
			.elementAttributeHasText("#entries > div:nth-child(1) > div.space-y-4 > div:nth-child(2) > a", "href",
					"/entries/1")
			.elementHasHtml("#__INIT_DATA__",
					"""
							{"preLoadedEntries":{"content":[{"entryId":2,"frontMatter":{"title":"entry2","categories":[],"tags":[]},"content":"","created":{"name":"demo","date":"2024-04-01T00:00:00Z"},"updated":{"name":"demo","date":"2024-04-02T00:00:00Z"}},{"entryId":1,"frontMatter":{"title":"entry1","categories":[],"tags":[]},"content":"","created":{"name":"demo","date":"2024-04-01T00:00:00Z"},"updated":{"name":"demo","date":"2024-04-01T00:00:00Z"}}],"size":2,"hasPrevious":false,"hasNext":true}}
							"""
						.trim());
	}

	@Test
	void getTags() throws Exception {
		given(this.tagApi.tags()).willReturn(Json.parse("""
				[
				  {
				    "name": "A",
				    "count": 1
				  },
				  {
				    "name": "B",
				    "count": 2
				  },
				  {
				    "name": "C",
				    "count": 1
				  }
				]
				""", new TypeReference<>() {
		}));

		String body = this.mvc.perform(get("/tags"))
			.andExpect(status().isOk())
			.andReturn()
			.getResponse()
			.getContentAsString();

		assertThatDocument(body) //
			.elementHasText("#tags li:nth-child(1)", "A (1)")
			.elementAttributeHasText("#tags li:nth-child(1) > a", "href", "/tags/A/entries")
			.elementHasText("#tags li:nth-child(2)", "B (2)")
			.elementAttributeHasText("#tags li:nth-child(2) > a", "href", "/tags/B/entries")
			.elementHasText("#tags li:nth-child(3)", "C (1)")
			.elementAttributeHasText("#tags li:nth-child(3) > a", "href", "/tags/C/entries")
			.elementHasHtml("#__INIT_DATA__",
					"""
							{"preLoadedTags":[{"name":"A","version":null,"count":1},{"name":"B","version":null,"count":2},{"name":"C","version":null,"count":1}]}
							"""
						.trim());
	}

	@Test
	void getCategories() throws Exception {
		given(this.categoryApi.categories()).willReturn(Json.parse("""
				[
				  [
				    {
				      "name": "a"
				    },
				    {
				      "name": "b"
				    }
				  ],
				  [
				    {
				      "name": "a"
				    },
				    {
				      "name": "b"
				    },
				    {
				      "name": "c"
				    }
				  ],
				  [
				    {
				      "name": "x"
				    },
				    {
				      "name": "y"
				    },
				    {
				      "name": "z"
				    }
				  ]
				]
				""", new TypeReference<>() {
		}));

		String body = this.mvc.perform(get("/categories"))
			.andExpect(status().isOk())
			.andReturn()
			.getResponse()
			.getContentAsString();

		assertThatDocument(body) //
			.elementHasText("#categories > div > div:nth-child(1) > ul > li:nth-child(1) > div", "a > b")
			.elementAttributeHasText(
					"#categories > div > div:nth-child(1) > ul > li:nth-child(1) > div > a:nth-child(1)", "href",
					"/categories/a/entries")
			.elementAttributeHasText(
					"#categories > div > div:nth-child(1) > ul > li:nth-child(1) > div > a:nth-child(3)", "href",
					"/categories/a,b/entries")
			.elementHasText("#categories > div > div:nth-child(1) > ul > li:nth-child(2) > div", "a > b > c")
			.elementAttributeHasText(
					"#categories > div > div:nth-child(1) > ul > li:nth-child(2) > div > a:nth-child(1)", "href",
					"/categories/a/entries")
			.elementAttributeHasText(
					"#categories > div > div:nth-child(1) > ul > li:nth-child(2) > div > a:nth-child(3)", "href",
					"/categories/a,b/entries")
			.elementAttributeHasText(
					"#categories > div > div:nth-child(1) > ul > li:nth-child(2) > div > a:nth-child(5)", "href",
					"/categories/a,b,c/entries")
			.elementHasText("#categories > div > div:nth-child(2) > ul > li > div", "x > y > z")
			.elementAttributeHasText("#categories > div > div:nth-child(2) > ul > li > div > a:nth-child(1)", "href",
					"/categories/x/entries")
			.elementAttributeHasText("#categories > div > div:nth-child(2) > ul > li > div > a:nth-child(3)", "href",
					"/categories/x,y/entries")
			.elementAttributeHasText("#categories > div > div:nth-child(2) > ul > li > div > a:nth-child(5)", "href",
					"/categories/x,y,z/entries")
			.elementHasHtml("#__INIT_DATA__",
					"""
							{"preLoadedCategories":[[{"name":"a"},{"name":"b"}],[{"name":"a"},{"name":"b"},{"name":"c"}],[{"name":"x"},{"name":"y"},{"name":"z"}]]}
							"""
						.trim());
	}

	@Test
	void concurrentAccess() throws Exception {
		given(this.entryClient.getEntry(100L, null)).willReturn(ResponseEntity.ok(entry100));
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

	@TestConfiguration
	static class Config {

		@Bean
		public ImageProxyReplacer imageProxyReplacer() {
			return new ImageProxyReplacer(null) {
				@Override
				public Entry replaceImage(Entry entry) {
					return entry;
				}
			};
		}

	}

}