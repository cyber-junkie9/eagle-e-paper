import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Eagle News Downloader",
  description: "Download Eagle News ePaper as JPG or PDF",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}