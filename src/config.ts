import type { ApiConfig } from "./shared";

export const API_CONFIG: ApiConfig = {
  name: "web-scraper",
  slug: "web-scraper",
  description: "Extract clean text, structured markdown, links, and metadata from any URL. Built for RAG pipelines, research agents, and content analysis.",
  version: "1.0.0",
  routes: [
    {
      method: "GET",
      path: "/api/scrape",
      price: "$0.005",
      description: "Scrape a URL and convert to clean markdown",
      toolName: "scrape_url_to_markdown",
      toolDescription: "Fetch any web page and extract clean, readable content as Markdown. Removes navigation, ads, scripts, and boilerplate. Returns the page title, clean markdown text, word count, and character count. Use when you need to read a web page's content, extract article text for summarization, feed web content into a RAG pipeline, research a topic from web sources, or convert HTML to clean text. Ideal for agents that need to understand web page content without rendering a browser.",
      inputSchema: {
        type: "object",
        properties: {
          url: { type: "string", description: "The URL to scrape (e.g. https://example.com/article)" },
        },
        required: ["url"],
      },
    },
    {
      method: "POST",
      path: "/api/scrape/batch",
      price: "$0.04",
      description: "Scrape up to 10 URLs in batch",
      toolName: "scrape_urls_batch",
      toolDescription: "Scrape multiple web pages at once (up to 10) and convert each to clean Markdown. Use when comparing content across multiple pages, building a research corpus, or extracting data from multiple sources simultaneously.",
      inputSchema: {
        type: "object",
        properties: {
          urls: { type: "array", items: { type: "string" }, description: "Array of URLs to scrape (max 10)" },
        },
        required: ["urls"],
      },
    },
  ],
};
