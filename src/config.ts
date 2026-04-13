import type { ApiConfig } from "./shared";

export const API_CONFIG: ApiConfig = {
  name: "web-scraper",
  slug: "web-scraper",
  description: "Extract clean markdown from any URL. Strips nav/ads/scripts, returns structured content. Built for RAG pipelines and AI research agents.",
  version: "1.0.0",
  routes: [
    {
      method: "GET",
      path: "/api/scrape",
      price: "$0.005",
      description: "Scrape a URL and convert to clean markdown",
      toolName: "web_scrape_to_markdown",
      toolDescription: `Use this when you need to read a webpage's content as clean, structured text. Returns markdown with metadata, stripped of all navigation, ads, scripts, and boilerplate.

1. title (string) -- page title from <title> tag
2. description (string) -- meta description
3. author (string) -- author from meta tags or schema
4. content (string) -- clean markdown body text, headings preserved
5. wordCount (number) -- total words in extracted content
6. charCount (number) -- total characters
7. url (string) -- final URL after redirects

Example output: {"title":"How to Scale APIs","description":"A guide to...","content":"# How to Scale APIs\\n\\nScaling requires...","wordCount":1250,"charCount":7800,"url":"https://blog.example.com/scale-apis"}

Use this BEFORE summarizing articles, building RAG corpora, researching topics from web sources, or extracting data from documentation pages. Essential for any workflow that needs webpage text as LLM input.

Do NOT use for screenshots -- use capture_screenshot instead. Do NOT use for SEO audit -- use seo_audit_page instead. Do NOT use for tech stack detection -- use website_detect_tech_stack instead. Do NOT use for web search -- use web_search_query instead.`,
      inputSchema: {
        type: "object",
        properties: {
          url: { type: "string", description: "URL to scrape (e.g. https://example.com/article)" },
        },
        required: ["url"],
      },
    },
    {
      method: "POST",
      path: "/api/scrape/batch",
      price: "$0.04",
      description: "Scrape up to 10 URLs in batch",
      toolName: "web_scrape_batch",
      toolDescription: `Use this when you need to extract clean content from multiple web pages at once (up to 10 URLs). Returns the same structured markdown output as web_scrape_to_markdown for each URL.

1. results (array) -- each entry has title, description, author, content, wordCount, charCount, url
2. summary -- total pages scraped, total word count, failed URLs if any

Example output: {"results":[{"url":"https://a.com","title":"Page A","wordCount":800},{"url":"https://b.com","title":"Page B","wordCount":1200}],"summary":{"total":2,"totalWords":2000,"failed":0}}

Use this FOR building research corpora, comparing content across competitor pages, or bulk documentation extraction. Essential when you have 3+ URLs to process in one workflow.

Do NOT use for single URLs -- use web_scrape_to_markdown instead. Do NOT use for SEO comparison -- use seo_audit_batch instead.`,
      inputSchema: {
        type: "object",
        properties: {
          urls: { type: "array", items: { type: "string" }, description: "Array of URLs (max 10)" },
        },
        required: ["urls"],
      },
    },
  ],
};
