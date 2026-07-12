import * as cheerio from "cheerio";
import { Paper, PaperPage } from "./types";

const BASE = process.env.SITE_URL || "https://eaglenews.in";

export async function getLatestPapers(): Promise<Paper[]> {

    const html = await fetch(
        `${BASE}/category/eagle-news-paper/`,
        {
            cache: "no-store"
        }
    ).then(r => r.text());

    const $ = cheerio.load(html);

    const papers: Paper[] = [];

    $("a").each((_, el) => {

        const href = $(el).attr("href");

        if (!href)
            return;

        if (!href.includes("eagle-news-e-paper-dt-"))
            return;

        if (papers.find(p => p.url === href))
            return;

        papers.push({

            title:
                $(el).text().trim() ||
                href.split("/").pop()!,

            slug:
                href.split("/").filter(Boolean).pop()!,

            url: href

        });

    });

    return papers.slice(0, 4);

}

export async function getPaperPages(slug:string){

    const browser=await chromium.launch();

    const page=await browser.newPage();

    await page.goto(

        `${BASE}/${slug}`,

        {

            waitUntil:"networkidle"

        }

    );

    await page.waitForSelector(

        ".flipbook-page3-bg img"

    );

    const images=await page.$$eval(

        ".flipbook-page3-bg img",

        imgs=>

            imgs.map((img,index)=>({

                page:index+1,

                image:img.src

            }))

    );

    await browser.close();

    return images;

}