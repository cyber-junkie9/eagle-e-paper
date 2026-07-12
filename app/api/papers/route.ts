import { NextResponse } from "next/server";
import { getLatestPapers } from "@/lib/scrape";

export async function GET() {

    try {

        const papers = await getLatestPapers();

        return NextResponse.json(papers);

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