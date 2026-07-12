import { NextRequest } from "next/server";

import { getPaperPages } from "@/lib/scrape";

import { buildPdf } from "@/lib/pdf";

export async function GET(
    request: NextRequest
) {

    try {

        const slug =
            request.nextUrl.searchParams.get("slug");

        if (!slug) {

            return new Response(
                "Missing slug",
                {
                    status: 400
                }
            );

        }

        const pages =
            await getPaperPages(slug);

        const pdf =
            await buildPdf(
                pages.map(p => p.image)
            );

        return new Response(pdf, {

            headers: {

                "Content-Type":
                    "application/pdf",

                "Content-Disposition":
                    `attachment; filename=${slug}.pdf`

            }

        });

    } catch (err: any) {

        return new Response(
            err.message,
            {
                status: 500
            }
        );

    }

}