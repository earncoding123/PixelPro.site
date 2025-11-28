import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Free Image Format Converter | JPG, PNG, WebP | FreeBg",
  description: "Instantly convert your images to JPG, PNG, or WebP formats for free. Adjust quality for the perfect balance of file size and clarity. All processing is done in your browser for privacy.",
  keywords: ["image converter", "format converter", "jpg to png", "png to jpg", "webp converter", "convert image online", "free image converter", "client-side converter"],
  openGraph: {
    title: "Free Image Format Converter | JPG, PNG, WebP | FreeBg",
    description: "Instantly convert your images to JPG, PNG, or WebP formats for free. Adjust quality for the perfect balance of file size and clarity. All processing is done in your browser."
  }
};

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
