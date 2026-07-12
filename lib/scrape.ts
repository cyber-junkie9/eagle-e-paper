import * as cheerio from "cheerio";
import type { Paper, PaperPage } from "./types";

const BASE = process.env.SITE_URL || "https://eaglenews.in";

export async function getLatestPapers(): Promise<Paper[]> {
    const html = await fetch(`${BASE}/category/eagle-news-paper/`, {
        cache: "no-store",
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
    }).then((r) => r.text());

    const $ = cheerio.load(html);

    const pages = $(".flipbook-page3-bg img")
        .map((i, el) => ({
            page: i + 1,
            image: $(el).attr("src") || "",
        }))
        .get()
        .filter((p) => p.image);

    return pages;
}
