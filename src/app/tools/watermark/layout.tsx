
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Watermark Tool | Protect Your Images | PixelPro",
  description: "Easily add a custom text or image watermark to your photos to protect your creative work. Customize opacity, position, and more. Coming soon!",
  keywords: ["watermark tool", "add watermark to photo", "image protection", "copyright image", "free watermark tool"],
};

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
