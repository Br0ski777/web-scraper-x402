import type { ApiConfig } from "./shared";

export const API_CONFIG: ApiConfig = {
  name: "web-scraper",
  slug: "web-scraper",
  description: "Extract clean markdown content from any URL. Built for RAG pipelines and research agents.",
  version: "1.0.0",
  routes: [
    {
      method: "GET",
      path: "/api/scrape",
      price: "$0.005",
      description: "Scrape a URL and convert to clean markdown",
      toolName: "web_scrape_to_markdown",
      toolDescription: "Use this when you need to read a webpage's content as clean text. Fetches the URL, removes navigation/ads/scripts/boilerplate, returns structured markdown with page title, meta description, author, clean content, word count, character count. Ideal for summarizing articles, feeding content into RAG pipelines, researching topics from web sources. Do NOT use for screenshots or visual rendering — use capture_screenshot instead.",
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
      toolDescription: "Use this when you need to extract content from multiple web pages at once (up to 10). Same output as web_scrape_to_markdown for each URL. Ideal for building research corpora or comparing content across pages. Do NOT use for single URLs.",
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
