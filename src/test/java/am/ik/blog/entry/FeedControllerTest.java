package am.ik.blog.entry;

import am.ik.blog.Json;
import am.ik.blog.config.SecurityConfig;
import am.ik.blog.entry.model.Entry;
import am.ik.blog.ssr.ReactRenderer;
import am.ik.pagination.CursorPage;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.core.type.TypeReference;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = FeedController.class,
		properties = { "logging.level.am.ik.blog=trace", "logging.structured.format.console=" })
@Import(SecurityConfig.class)
class FeedControllerTest {

	@Autowired
	MockMvc mvc;

	@MockitoBean
	EntryClient entryClient;

	@MockitoBean
	ReactRenderer reactRenderer;

	@Test
	void feedWithSummary() throws Exception {
		given(this.entryClient.getEntries(any(), any())).willReturn(ResponseEntity.ok(new CursorPage<>(Json.parse("""
				[
				  {
				    "entryId": 100,
				    "frontMatter": {
				      "title": "Hello World!",
				      "summary": "This is a test summary",
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
				  }
				]
				""", new TypeReference<>() {
		}), 1, Entry::toCursor, false, false)));

		String body = this.mvc.perform(get("/feed"))
			.andExpect(status().isOk())
			.andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_XML))
			.andReturn()
			.getResponse()
			.getContentAsString();

		assertThat(body).contains("<title><![CDATA[Hello World!]]></title>");
		assertThat(body).contains("<description><![CDATA[This is a test summary]]></description>");
		assertThat(body).contains("<link>http://localhost/entries/100</link>");
		assertThat(body).contains("<guid isPermaLink=\"true\">http://localhost/entries/100</guid>");
		assertThat(body).contains("Tue, 02 Apr 2024 00:00:00 GMT");
	}

	@Test
	void feedWithoutSummary() throws Exception {
		given(this.entryClient.getEntries(any(), any())).willReturn(ResponseEntity.ok(new CursorPage<>(Json.parse("""
				[
				  {
				    "entryId": 200,
				    "frontMatter": {
				      "title": "No Summary Entry",
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
				      "date": "2024-04-03T00:00:00Z"
				    }
				  }
				]
				""", new TypeReference<>() {
		}), 1, Entry::toCursor, false, false)));

		String body = this.mvc.perform(get("/rss"))
			.andExpect(status().isOk())
			.andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_XML))
			.andReturn()
			.getResponse()
			.getContentAsString();

		assertThat(body).contains("<title><![CDATA[No Summary Entry]]></title>");
		// Channel has description, but item should not have description
		assertThat(body).contains("<description><![CDATA[@making's tech note]]></description>");
		// Item should not contain description (only 1 description for channel)
		int descriptionCount = body.split("<description>").length - 1;
		assertThat(descriptionCount).isEqualTo(1);
		assertThat(body).contains("<link>http://localhost/entries/200</link>");
	}

	@Test
	void feedWithTenant() throws Exception {
		given(this.entryClient.getEntries(any(), any())).willReturn(ResponseEntity.ok(new CursorPage<>(Json.parse("""
				[
				  {
				    "entryId": 300,
				    "frontMatter": {
				      "title": "English Entry",
				      "summary": "English summary",
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
				      "date": "2024-04-04T00:00:00Z"
				    }
				  }
				]
				""", new TypeReference<>() {
		}), 1, Entry::toCursor, false, false)));

		String body = this.mvc.perform(get("/feed/en"))
			.andExpect(status().isOk())
			.andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_XML))
			.andReturn()
			.getResponse()
			.getContentAsString();

		assertThat(body).contains("<title><![CDATA[English Entry]]></title>");
		assertThat(body).contains("<description><![CDATA[English summary]]></description>");
		assertThat(body).contains("<link>http://localhost/tenants/en/entries/300</link>");
	}

	@Test
	void feedEmpty() throws Exception {
		given(this.entryClient.getEntries(any(), any()))
			.willReturn(ResponseEntity.ok(new CursorPage<>(List.of(), 0, Entry::toCursor, false, false)));

		String body = this.mvc.perform(get("/feed"))
			.andExpect(status().isOk())
			.andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_XML))
			.andReturn()
			.getResponse()
			.getContentAsString();

		assertThat(body).contains("<title><![CDATA[IK.AM]]></title>");
		assertThat(body).contains("<description><![CDATA[@making's tech note]]></description>");
		assertThat(body).doesNotContain("<item>");
	}

	@Test
	void feedMixedSummary() throws Exception {
		given(this.entryClient.getEntries(any(), any())).willReturn(ResponseEntity.ok(new CursorPage<>(Json.parse("""
				[
				  {
				    "entryId": 2,
				    "frontMatter": {
				      "title": "Entry with summary",
				      "summary": "This entry has a summary",
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
				      "title": "Entry without summary",
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
		}), 2, Entry::toCursor, false, true)));

		String body = this.mvc.perform(get("/feed"))
			.andExpect(status().isOk())
			.andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_XML))
			.andReturn()
			.getResponse()
			.getContentAsString();

		// Entry with summary should have description
		assertThat(body).contains("<title><![CDATA[Entry with summary]]></title>");
		assertThat(body).contains("<description><![CDATA[This entry has a summary]]></description>");

		// Entry without summary should not have description
		assertThat(body).contains("<title><![CDATA[Entry without summary]]></title>");

		// Count occurrences of description - should be 2 (1 for channel + 1 for item with
		// summary)
		int descriptionCount = body.split("<description>").length - 1;
		assertThat(descriptionCount).isEqualTo(2);
	}

}
