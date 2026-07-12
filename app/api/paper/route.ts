import { NextRequest, NextResponse } from "next/server";
import { getPaperPages } from "@/lib/scrape";

export async function GET(
    request: NextRequest
) {

    try {

        const slug =
            request.nextUrl.searchParams.get("slug");

        if (!slug) {

            return NextResponse.json(
                {
                    error: "Missing slug"
                },
                {
                    status: 400
                }
            );

        }

        const pages =
            await getPaperPages(slug);

        return NextResponse.json({

            slug,

            totalPages: pages.length,

            pages

        });

    } catch (err: any) {

        return NextResponse.json(
            {
                error: err.message
            },
            {
                status: 500
            }
        );

    }

}