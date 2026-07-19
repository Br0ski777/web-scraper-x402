# Web Scraper to Markdown API

[![MCP Server](https://img.shields.io/badge/MCP-server-blue)](https://web-scraper.api.klymax402.com/mcp)
[![x402](https://img.shields.io/badge/payments-x402-6E56CF)](https://x402.org)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)](LICENSE)

Extract clean markdown from any URL. Strips nav/ads/scripts, returns structured content. Built for RAG pipelines and AI research agents. Pay-per-call via [x402](https://x402.org) (USDC on Base L2) -- no API key, no signup, no rate-limit wall.

Part of the [klymax402](https://klymax402.com) marketplace -- 100 x402 micropayment APIs for AI agents, one wallet, USDC on Base.

## Quickstart -- MCP

Add to your MCP client config (Claude Desktop, Cursor, ElizaOS, etc.):

```json
{
  "mcpServers": {
    "web-scraper": {
      "url": "https://web-scraper.api.klymax402.com/mcp"
    }
  }
}
```

## Quickstart -- HTTP (x402)

```bash
curl "https://web-scraper.api.klymax402.com/api/scrape?url=https://example.com"
# -> 402 Payment Required, with an x402 payment challenge in the response body
```

Any x402-aware client ([`@x402/fetch`](https://www.npmjs.com/package/@x402/fetch), [`x402-agent-tools`](https://www.npmjs.com/package/x402-agent-tools), ATXP) handles the 402 -> sign -> retry cycle automatically.

## Tools

| Tool | Method | Path | Price | Description |
|---|---|---|---|---|
| `web_scrape_to_markdown` | GET | `/api/scrape` | $0.012 | Scrape a URL and convert to clean markdown |
| `web_scrape_batch` | POST | `/api/scrape/batch` | $0.05 | Scrape up to 10 URLs in batch |

### `web_scrape_to_markdown`

Scrape and extract content from a URL with full JS rendering, returned as clean markdown. Alternative to Firecrawl scrape at 2.5x lower cost. Strips navigation, ads, scripts, and boilerplate — ideal for RAG pipelines and AI research agents.

**Parameters**

| Name | Type | Required | Description |
|---|---|---|---|
| `url` | string | yes | URL to scrape (e.g. https://example.com/article) |

Example response:

```json
{"title":"How to Scale APIs","description":"A guide to...","content":"# How to Scale APIs\n\nScaling requires...","wordCount":1250,"charCount":7800,"url":"https://blog.example.com/scale-apis"}
```

**When to use**: summarizing articles, building RAG corpora, researching topics from web sources, or extracting data from documentation pages. Essential for any workflow that needs to scrape and extract content from web pages as LLM input. Drop-in replacement for Firecrawl scrape.

**Not for**: screenshots (use `capture_screenshot`), SEO audit (use `seo_audit_page`), tech stack detection (use `website_detect_tech_stack`), web search (use `web_search_query`).

### `web_scrape_batch`

Use this when you need to extract clean content from multiple web pages at once (up to 10 URLs). Returns the same structured markdown output as web_scrape_to_markdown for each URL.

**Parameters**

| Name | Type | Required | Description |
|---|---|---|---|
| `urls` | array | yes | Array of URLs (max 10) |

Example response:

```json
{"results":[{"url":"https://a.com","title":"Page A","wordCount":800},{"url":"https://b.com","title":"Page B","wordCount":1200}],"summary":{"total":2,"totalWords":2000,"failed":0}}
```

**When to use**: building research corpora, comparing content across competitor pages, or bulk documentation extraction. Essential when you have 3+ URLs to process in one workflow.

**Not for**: single URLs (use `web_scrape_to_markdown`), SEO comparison (use `seo_audit_batch`).

## Example agent prompts

- "Scrape and extract content from a URL with full JS rendering, returned as clean markdown"
- "Extract clean content from multiple web pages at once (up to 10 URLs)"

## Payment

- Protocol: [x402](https://x402.org) -- HTTP-native pay-per-call, no signup, no API key
- Network: Base L2 (`eip155:8453`)
- Asset: USDC
- Facilitator: Coinbase CDP (primary), PayAI (fallback)
- Also reachable via [ATXP](https://atxp.ai) (OAuth-wrapped x402, RFC 9728 protected-resource metadata)

## Part of klymax402

100 x402 micropayment APIs for AI agents -- one wallet, USDC on Base, zero signup.

- Catalog: https://klymax402.com/llms.txt
- Full API reference: https://klymax402.com/llms-full.txt
- Live stats: https://klymax402.com/stats

## License

MIT
