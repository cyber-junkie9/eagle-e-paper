import { PDFDocument } from "pdf-lib";

export async function buildPdf(images: string[]): Promise<Uint8Array> {
    const pdf = await PDFDocument.create();

    for (const imageUrl of images) {
        const bytes = await fetch(imageUrl).then((r) => r.arrayBuffer());

        const embedded = imageUrl.toLowerCase().endsWith(".png")
            ? await pdf.embedPng(bytes)
            : await pdf.embedJpg(bytes);

        const page = pdf.addPage([embedded.width, embedded.height]);

        page.drawImage(embedded, {
            x: 0,
            y: 0,
            width: embedded.width,
            height: embedded.height,
        });
    }

    return await pdf.save();
}
