import { PDFDocument } from "pdf-lib";

export async function buildPdf(
    images: string[]
) {

    const pdf = await PDFDocument.create();

    for (const imageUrl of images) {

        const bytes = await fetch(imageUrl)
            .then(r => r.arrayBuffer());

        let embedded;

        if (imageUrl.toLowerCase().endsWith(".png")) {

            embedded =
                await pdf.embedPng(bytes);

        }
        else {

            embedded =
                await pdf.embedJpg(bytes);

        }

        const page = pdf.addPage([
            embedded.width,
            embedded.height
        ]);

        page.drawImage(embedded, {

            x: 0,

            y: 0,

            width: embedded.width,

            height: embedded.height

        });

    }

    return await pdf.save();

}