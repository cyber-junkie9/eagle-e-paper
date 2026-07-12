import Link from "next/link";
import { getLatestPapers } from "@/lib/scrape";

export const dynamic = "force-dynamic";

export default async function Home() {

    const papers = await getLatestPapers();

    return (

        <main className="container">

            <h1
                style={{
                    fontSize: 38,
                    marginBottom: 10
                }}
            >
                📰 Eagle News Downloader
            </h1>

            <p
                style={{
                    color: "#666",
                    marginBottom: 40
                }}
            >
                Latest 4 Sunday Editions
            </p>

            <div className="paper-grid">

                {papers.map((paper) => (

                    <div
                        key={paper.slug}
                        className="paper-card"
                    >

                        <h2
                            style={{
                                fontSize: 20,
                                marginBottom: 15
                            }}
                        >
                            {paper.title}
                        </h2>

                        <p
                            style={{
                                color: "#777",
                                fontSize: 14
                            }}
                        >
                            {paper.slug}
                        </p>

                        <Link
                            href={`/paper/${paper.slug}`}
                            className="paper-btn"
                        >
                            Open Paper →
                        </Link>

                    </div>

                ))}

            </div>

        </main>

    );

}