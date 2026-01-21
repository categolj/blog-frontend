package am.ik.blog.e2e;

import am.ik.blog.MockConfig;
import am.ik.blog.mockserver.MockServer;
import am.ik.blog.mockserver.MockServer.Response;
import com.microsoft.playwright.Browser;
import com.microsoft.playwright.BrowserType;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.Playwright;
import com.microsoft.playwright.options.WaitUntilState;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.client.RestTestClient;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Import(MockConfig.class)
class E2ETest {

	@LocalServerPort
	int port;

	@Autowired
	MockServer mockServer;

	static Playwright playwright;

	static Browser browser;

	Page page;

	RestTestClient restTestClient;

	@BeforeAll
	static void launchBrowser() {
		playwright = Playwright.create();
		browser = playwright.chromium().launch(new BrowserType.LaunchOptions().setHeadless(true));
	}

	@AfterAll
	static void closeBrowser() {
		browser.close();
		playwright.close();
	}

	@BeforeEach
	void setUp() {
		page = browser.newPage();
		this.mockServer.reset();
		this.restTestClient = RestTestClient.bindToServer().baseUrl("http://localhost:" + port).build();
	}

	@AfterEach
	void closePage() {
		page.close();
	}

	@Test
	void getEntry() {
		mockServer.GET("/entries/100", request -> Response.json("""
				{
				  "entryId": 100,
				  "frontMatter": {
				    "title": "Hello World!",
				    "summary": "This is a test summary for OGP",
				    "categories": [{"name": "a"}, {"name": "b"}, {"name": "c"}],
				    "tags": [{"name": "x"}, {"name": "y"}, {"name": "z"}]
				  },
				  "content": "Welcome\\n**Hello world**, this is my first blog post.\\nI hope you like it!",
				  "created": {"name": "demo", "date": "2024-04-01T00:00:00Z"},
				  "updated": {"name": "demo", "date": "2024-04-01T00:00:00Z"}
				}
				"""));
		// Mock counter API - CounterClient sends POST to counter-api.url
		mockServer.POST("/", request -> Response.json("""
				{"counter": 42}
				"""));

		page.navigate("http://localhost:%d/entries/100".formatted(port),
				new Page.NavigateOptions().setWaitUntil(WaitUntilState.NETWORKIDLE));

		assertThat(page.locator("#root h2 > a")).hasText("Hello World!");
		assertThat(page.locator("#root h2 > a")).hasAttribute("href", "/entries/100");
		assertThat(page.locator("#root article > p > strong")).hasText("Hello world");
		// Verify counter is displayed
		assertThat(page.getByText("42 Views")).isVisible();
		// Verify OGP meta tags use summary
		assertThat(page.locator("meta[name='description']")).hasAttribute("content", "This is a test summary for OGP");
		assertThat(page.locator("meta[property='og:description']")).hasAttribute("content",
				"This is a test summary for OGP");
	}

	@Test
	void getEntry404() {
		// Return 404 with empty body (as EntryClient expects)
		mockServer.GET("/entries/100",
				request -> Response.builder().status(404).contentType("application/json").build());

		page.navigate("http://localhost:%d/entries/100".formatted(port),
				new Page.NavigateOptions().setWaitUntil(WaitUntilState.NETWORKIDLE));

		assertThat(page.locator("#root h2")).hasText("Not Found");
	}

	@Test
	void getEntries() {
		mockServer.GET("/entries", request -> Response
			.json("""
					{
					  "content": [
					    {
					      "entryId": 2,
					      "frontMatter": {"title": "entry2", "summary": "This is the summary for entry2", "categories": [], "tags": []},
					      "content": "",
					      "created": {"name": "demo", "date": "2024-04-01T00:00:00Z"},
					      "updated": {"name": "demo", "date": "2024-04-02T00:00:00Z"}
					    },
					    {
					      "entryId": 1,
					      "frontMatter": {"title": "entry1", "categories": [], "tags": []},
					      "content": "",
					      "created": {"name": "demo", "date": "2024-04-01T00:00:00Z"},
					      "updated": {"name": "demo", "date": "2024-04-01T00:00:00Z"}
					    }
					  ],
					  "size": 2,
					  "hasPrevious": false,
					  "hasNext": true
					}
					"""));

		page.navigate("http://localhost:%d/entries".formatted(port),
				new Page.NavigateOptions().setWaitUntil(WaitUntilState.NETWORKIDLE));

		assertThat(page.locator("#entries > div:nth-child(1) > div.space-y-4 > div:nth-child(1) > a"))
			.hasText("entry2");
		assertThat(page.locator("#entries > div:nth-child(1) > div.space-y-4 > div:nth-child(1) > a"))
			.hasAttribute("href", "/entries/2");
		// Verify summary is displayed for entry2
		assertThat(page.locator("#entries > div:nth-child(1) > div.space-y-4 > div:nth-child(1) > p"))
			.hasText("This is the summary for entry2");
		assertThat(page.locator("#entries > div:nth-child(1) > div.space-y-4 > div:nth-child(2) > a"))
			.hasText("entry1");
		assertThat(page.locator("#entries > div:nth-child(1) > div.space-y-4 > div:nth-child(2) > a"))
			.hasAttribute("href", "/entries/1");
		// Verify no summary element exists for entry1 (no summary field)
		assertThat(page.locator("#entries > div:nth-child(1) > div.space-y-4 > div:nth-child(2) > p")).hasCount(0);
	}

	@Test
	void getTags() {
		mockServer.GET("/tags", request -> Response.json("""
				[
				  {"name": "A", "count": 1},
				  {"name": "B", "count": 2},
				  {"name": "C", "count": 1}
				]
				"""));

		page.navigate("http://localhost:%d/tags".formatted(port),
				new Page.NavigateOptions().setWaitUntil(WaitUntilState.NETWORKIDLE));

		assertThat(page.locator("#tags li:nth-child(1)")).hasText("A (1)");
		assertThat(page.locator("#tags li:nth-child(1) > a")).hasAttribute("href", "/tags/A/entries");
		assertThat(page.locator("#tags li:nth-child(2)")).hasText("B (2)");
		assertThat(page.locator("#tags li:nth-child(2) > a")).hasAttribute("href", "/tags/B/entries");
		assertThat(page.locator("#tags li:nth-child(3)")).hasText("C (1)");
		assertThat(page.locator("#tags li:nth-child(3) > a")).hasAttribute("href", "/tags/C/entries");
	}

	@Test
	void getCategories() {
		mockServer.GET("/categories", request -> Response.json("""
				[
				  [{"name": "a"}, {"name": "b"}],
				  [{"name": "a"}, {"name": "b"}, {"name": "c"}],
				  [{"name": "x"}, {"name": "y"}, {"name": "z"}]
				]
				"""));

		page.navigate("http://localhost:%d/categories".formatted(port),
				new Page.NavigateOptions().setWaitUntil(WaitUntilState.NETWORKIDLE));

		assertThat(page.locator("#categories > div > div:nth-child(1) > ul > li:nth-child(1) > div")).hasText("a > b");
		assertThat(page.locator("#categories > div > div:nth-child(1) > ul > li:nth-child(1) > div > a:nth-child(1)"))
			.hasAttribute("href", "/categories/a/entries");
		assertThat(page.locator("#categories > div > div:nth-child(1) > ul > li:nth-child(1) > div > a:nth-child(3)"))
			.hasAttribute("href", "/categories/a,b/entries");
		assertThat(page.locator("#categories > div > div:nth-child(1) > ul > li:nth-child(2) > div"))
			.hasText("a > b > c");
		assertThat(page.locator("#categories > div > div:nth-child(2) > ul > li > div")).hasText("x > y > z");
	}

	@Test
	void spaNavigationFromEntriesToEntry() {
		// Setup mock for entries list
		mockServer.GET("/entries", request -> Response.json("""
				{
				  "content": [
				    {
				      "entryId": 100,
				      "frontMatter": {"title": "Hello World!", "categories": [], "tags": []},
				      "content": "",
				      "created": {"name": "demo", "date": "2024-04-01T00:00:00Z"},
				      "updated": {"name": "demo", "date": "2024-04-01T00:00:00Z"}
				    }
				  ],
				  "size": 1,
				  "hasPrevious": false,
				  "hasNext": false
				}
				"""));
		// Setup mock for single entry
		mockServer.GET("/entries/100", request -> Response.json("""
				{
				  "entryId": 100,
				  "frontMatter": {
				    "title": "Hello World!",
				    "categories": [{"name": "a"}],
				    "tags": [{"name": "x"}]
				  },
				  "content": "Welcome to my blog!",
				  "created": {"name": "demo", "date": "2024-04-01T00:00:00Z"},
				  "updated": {"name": "demo", "date": "2024-04-01T00:00:00Z"}
				}
				"""));

		// Navigate to entries list
		page.navigate("http://localhost:%d/entries".formatted(port),
				new Page.NavigateOptions().setWaitUntil(WaitUntilState.NETWORKIDLE));

		// Click on entry link (SPA navigation)
		page.locator("#entries a[href='/entries/100']").click();
		page.waitForURL("**/entries/100");

		// Verify SPA navigation worked - entry detail page should be displayed
		assertThat(page.locator("#root h2 > a")).hasText("Hello World!");
		assertThat(page.locator("#root article")).containsText("Welcome to my blog!");
	}

	@Test
	void spaNavigationFromTagsToEntries() {
		// Setup mock for tags list
		mockServer.GET("/tags", request -> Response.json("""
				[
				  {"name": "Java", "count": 5}
				]
				"""));
		// Setup mock for tag entries - React calls /entries?tag=Java
		mockServer.route(
				request -> request.method() == MockServer.HttpMethod.GET && request.path().equals("/entries")
						&& "Java".equals(request.queryParam("tag")),
				request -> Response.json("""
						{
						  "content": [
						    {
						      "entryId": 1,
						      "frontMatter": {"title": "Java Article", "categories": [], "tags": [{"name": "Java"}]},
						      "content": "",
						      "created": {"name": "demo", "date": "2024-04-01T00:00:00Z"},
						      "updated": {"name": "demo", "date": "2024-04-01T00:00:00Z"}
						    }
						  ],
						  "size": 1,
						  "hasPrevious": false,
						  "hasNext": false
						}
						"""));

		// Navigate to tags list
		page.navigate("http://localhost:%d/tags".formatted(port),
				new Page.NavigateOptions().setWaitUntil(WaitUntilState.NETWORKIDLE));

		// Click on tag link using JavaScript to avoid visibility issues with sr-only
		// elements
		page.evaluate("document.querySelector(\"#tags a[href='/tags/Java/entries']\").click()");
		page.waitForURL("**/tags/Java/entries");

		// Verify SPA navigation worked - entries by tag should be displayed
		assertThat(page.locator("#entries a[href='/entries/1']").first()).hasText("Java Article");
	}

	@Test
	void getLlmsTxt() {
		// Mock Japanese entries (no tenant)
		mockServer.GET("/entries", request -> Response.json("""
				{
				  "content": [
				    {
				      "entryId": 100,
				      "frontMatter": {"title": "Japanese Entry", "categories": [], "tags": []},
				      "content": "",
				      "created": {"name": "demo", "date": "2024-04-01T00:00:00Z"},
				      "updated": {"name": "demo", "date": "2024-04-02T00:00:00Z"}
				    }
				  ],
				  "size": 1,
				  "hasPrevious": false,
				  "hasNext": false
				}
				"""));
		// Mock English entries (tenant=en)
		mockServer.GET("/tenants/en/entries", request -> Response.json("""
				{
				  "content": [
				    {
				      "entryId": 200,
				      "frontMatter": {"title": "English Entry", "categories": [], "tags": []},
				      "content": "",
				      "created": {"name": "demo", "date": "2024-04-01T00:00:00Z"},
				      "updated": {"name": "demo", "date": "2024-04-03T00:00:00Z"}
				    }
				  ],
				  "size": 1,
				  "hasPrevious": false,
				  "hasNext": false
				}
				"""));

		restTestClient.get()
			.uri("/llms.txt")
			.exchange()
			.expectStatus()
			.isOk()
			.expectHeader()
			.contentType("text/plain;charset=UTF-8")
			.expectBody(String.class)
			.value(body -> {
				org.assertj.core.api.Assertions.assertThat(body).contains("# IK.AM");
				org.assertj.core.api.Assertions.assertThat(body).contains("- [Japanese Entry](/entries/100.md)");
				org.assertj.core.api.Assertions.assertThat(body).contains("- [English Entry](/entries/200/en.md)");
			});
	}

}
