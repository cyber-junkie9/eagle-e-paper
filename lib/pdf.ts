import { PDFDocument } from "pdf-lib";

export async function buildPdf(images: string[]): Promise<ArrayBuffer> {
    const pdf = await PDFDocument.create();

    for (const imageUrl of images) {
        const bytes = await fetch(imageUrl).then((r) => r.arrayBuffer());

        let embedded;

        if (imageUrl.toLowerCase().endsWith(".png")) {
            embedded = await pdf.embedPng(bytes);
        } else {
            embedded = await pdf.embedJpg(bytes);
        }

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

    // pdf.save() returns Uint8Array
    const pdfBytes = await pdf.save();

    // Convert Uint8Array -> ArrayBuffer
    return pdfBytes.buffer.slice(
        pdfBytes.byteOffset,
        pdfBytes.byteOffset + pdfBytes.byteLength
    );
}
