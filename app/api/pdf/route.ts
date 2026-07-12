export const runtime = "nodejs";

import { NextRequest } from "next/server";

import { getPaperPages } from "@/lib/scrape";
import { buildPdf } from "@/lib/pdf";
import type { PaperPage } from "@/lib/types";

export async function GET(request: NextRequest) {
    try {
        const slug = request.nextUrl.searchParams.get("slug");

        if (!slug) {
            return new Response("Missing slug", {
                status: 400,
            });
        }

        const pages: PaperPage[] = await getPaperPages(slug);

        const imageUrls: string[] = pages.map(
            (page: PaperPage) => page.image
        );

        const pdf = await buildPdf(imageUrls);

        return new Response(Buffer.from(pdf), {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename=${slug}.pdf`,
            },
        });
    } catch (error: unknown) {
        const message =
            error instanceof Error
                ? error.message
                : "Unknown error";

        return new Response(message, {
            status: 500,
        });
    }
}
