import { PDFDocument } from "pdf-lib";

export async function buildPdf(images: string[]): Promise<ArrayBuffer> {
    const pdf = await PDFDocument.create();

    for (const imageUrl of images) {
        const bytes = await fetch(imageUrl).then((r) => r.arrayBuffer());

        const embedded = imageUrl.toLowerCase().endsWith(".png")
            ? await pdf.embedPng(bytes)
            : await pdf.embedJpg(bytes);

        const page = pdf.addPage([
            embedded.width,
            embedded.height,
        ]);

        page.drawImage(embedded, {
            x: 0,
            y: 0,
            width: embedded.width,
            height: embedded.height,
        });
    }

    const pdfBytes = await pdf.save();

    // Create a brand new ArrayBuffer
    const arrayBuffer = new ArrayBuffer(pdfBytes.length);
    const view = new Uint8Array(arrayBuffer);

    view.set(pdfBytes);

    return arrayBuffer;
}
