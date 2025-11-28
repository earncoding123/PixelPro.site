import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Free AI Background Remover | Remove BG from Images | PixelPro",
  description: "Instantly remove the background from any image for free with our AI-powered tool. Get a transparent background in seconds. No account required.",
  keywords: ["background remover", "remove background", "transparent background", "free background remover", "image background removal", "png maker"],
};

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
