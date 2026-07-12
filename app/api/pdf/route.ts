export const runtime = "nodejs";

import { NextRequest } from "next/server";
import { getPaperPages } from "@/lib/scrape";
import { buildPdf } from "@/lib/pdf";
import type { PaperPage } from "@/lib/types";

export async function GET(request: NextRequest) {
    try {
        const slug = request.nextUrl.searchParams.get("slug");

        if (!slug) {
            return new Response("Missing slug", { status: 400 });
        }

        const pages: PaperPage[] = await getPaperPages(slug);

        const imageUrls = pages.map((page) => page.image);

        const pdf = await buildPdf(imageUrls);

        // Convert Uint8Array -> Blob
        const blob = new Blob([pdf], {
            type: "application/pdf",
        });

        return new Response(blob, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="${slug}.pdf"`,
            },
        });
    } catch (error) {
        return new Response(
            error instanceof Error ? error.message : "Unknown error",
            { status: 500 }
        );
    }
}
