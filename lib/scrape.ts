import * as cheerio from "cheerio";
import type { Paper, PaperPage } from "./types";

const BASE = process.env.SITE_URL || "https://eaglenews.in";

const HEADERS = {
    "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
};

export async function getLatestPapers(): Promise<Paper[]> {
    const html = await fetch(`${BASE}/category/eagle-news-paper/`, {
        cache: "no-store",
        headers: HEADERS,
    }).then((r) => r.text());

    const $ = cheerio.load(html);
    const papers: Paper[] = [];

    $("a").each((_, el) => {
        const href = $(el).attr("href");
        if (!href) return;
        if (!href.includes("eagle-news-e-paper-dt-")) return;
        if (papers.some((p) => p.url === href)) return;

        papers.push({
            title: $(el).text().trim() || href.split("/").pop() || href,
            slug: href.split("/").filter(Boolean).pop() || "",
            url: href,
        });
    });

    return papers.slice(0, 4);
}

export async function getPaperPages(slug: string): Promise<PaperPage[]> {
    const html = await fetch(`${BASE}/${slug}/`, {
        cache: "no-store",
        headers: HEADERS,
    }).then((r) => r.text());

    const $ = cheerio.load(html);

    const optionsAttr = $(".real3dflipbook").first().attr("data-flipbook-options");

    if (!optionsAttr) {
        throw new Error(`No flipbook found on page for slug "${slug}"`);
    }

    let config: { pages?: { src: string; thumb?: string; title?: string }[] };

    try {
        config = JSON.parse(optionsAttr);
    } catch {
        throw new Error("Failed to parse flipbook options JSON");
    }

    if (!config.pages || config.pages.length === 0) {
        throw new Error(`Flipbook config has no pages for slug "${slug}"`);
    }

    return config.pages.map((p, i) => ({
        page: i + 1,
        image: p.src,
        thumbnail: p.thumb,
    }));
}
