import type { Hono } from "hono";
import { parse } from "node-html-parser";
import TurndownService from "turndown";

const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
const TIMEOUT_MS = 15_000;
const MAX_BATCH = 10;
const REMOVE_TAGS = ["script", "style", "nav", "footer", "header", "iframe", "aside"];

function createTurndown(): TurndownService {
  const td = new TurndownService({ headingStyle: "atx", hr: "---", codeBlockStyle: "fenced", bulletListMarker: "-" });
  td.remove(["script", "style", "nav", "footer", "header", "iframe"]);
  return td;
}

function cleanHtml(html: string): string {
  const root = parse(html);
  for (const tag of REMOVE_TAGS) root.querySelectorAll(tag).forEach((el) => el.remove());
  return root.toString();
}

function extractTitle(html: string): string | null {
  return parse(html).querySelector("title")?.text.trim() ?? null;
}

function extractMeta(html: string) {
  const root = parse(html);
  return {
    description: root.querySelector('meta[name="description"]')?.getAttribute("content") ?? null,
    author: root.querySelector('meta[name="author"]')?.getAttribute("content") ?? null,
    keywords: root.querySelector('meta[name="keywords"]')?.getAttribute("content") ?? null,
  };
}

async function fetchAndConvert(url: string) {
  try { new URL(url); } catch { return { url, error: "Invalid URL" }; }
  try {
    const response = await fetch(url, { headers: { "User-Agent": USER_AGENT }, signal: AbortSignal.timeout(TIMEOUT_MS) });
    if (!response.ok) return { url, error: `HTTP ${response.status}` };
    const html = await response.text();
    const title = extractTitle(html);
    const meta = extractMeta(html);
    const cleaned = cleanHtml(html);
    const markdown = createTurndown().turndown(cleaned);
    const wordCount = markdown.trim().split(/\s+/).filter((w) => w.length > 0).length;
    return { url, title, meta, markdown, character_count: markdown.length, word_count: wordCount };
  } catch (err: any) {
    return { url, error: err.message ?? "Fetch failed" };
  }
}

export function registerRoutes(app: Hono) {
  app.get("/api/scrape", async (c) => {
    const url = c.req.query("url");
    if (!url) return c.json({ error: "Missing 'url' query parameter" }, 400);
    try { new URL(url); } catch { return c.json({ error: "Invalid URL" }, 400); }
    const result = await fetchAndConvert(url);
    if ("error" in result) return c.json(result, 422);
    return c.json(result);
  });

  app.post("/api/scrape/batch", async (c) => {
    const body = await c.req.json<{ urls?: string[] }>();
    if (!Array.isArray(body.urls) || body.urls.length === 0)
      return c.json({ error: "Missing or invalid 'urls' array" }, 400);
    if (body.urls.length > MAX_BATCH)
      return c.json({ error: `Maximum ${MAX_BATCH} URLs per batch` }, 400);
    const results = await Promise.allSettled(body.urls.map(fetchAndConvert));
    return c.json(results.map((r, i) =>
      r.status === "fulfilled" ? r.value : { url: body.urls![i], error: r.reason?.message }
    ));
  });
}
