import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "AI Watermark Remover | Remove Watermarks from Images | PixelPro",
  description: "Easily remove watermarks from your images with our AI-powered tool. Clean up your photos in seconds. Coming soon!",
  keywords: ["watermark remover", "remove watermark from photo", "image cleaning", "AI photo restoration", "free watermark removal"],
};

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
