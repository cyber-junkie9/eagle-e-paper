import Link from "next/link";
import { getPaperPages } from "@/lib/scrape";

export const dynamic = "force-dynamic";

export default async function PaperPage({
    params,
}: {
    params: Promise<{
        slug: string;
    }>;
}) {

    const { slug } = await params;

    const pages = await getPaperPages(slug);

    return (

        <main className="container">

            <Link
                href="/"
            >
                ← Back
            </Link>

            <h1
                style={{
                    marginTop: 20,
                    marginBottom: 10
                }}
            >
                {slug}
            </h1>

            <a
                className="pdf-btn"
                href={`/api/pdf?slug=${slug}`}
            >
                Download Complete PDF
            </a>

            <div className="page-grid">

                {pages.map((page) => (

                    <div
                        key={page.page}
                        className="paper-card"
                    >

                        <h3>

                            Page {page.page}

                        </h3>

                        <img
                            src={page.image}
                            alt={`Page ${page.page}`}
                            className="page-image"
                        />

                        <div
                            style={{
                                marginTop: 15,
                                display: "flex",
                                gap: 10
                            }}
                        >

                            <a
                                className="paper-btn"
                                href={page.image}
                                target="_blank"
                            >
                                View
                            </a>

                            <a
                                className="download-btn"
                                href={page.image}
                                download
                            >
                                JPG
                            </a>

                        </div>

                    </div>

                ))}

            </div>

        </main>

    );

}