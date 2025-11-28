import type { Metadata } from 'next';

export const metadata: Metadata = {
<<<<<<< HEAD
  title: "Free Logo Extractor Tool | Isolate Logos from Images | FreeBg",
  description: "Isolate and extract a logo from any image with a simple background. Our threshold tool makes it easy to create a transparent PNG of your logo. No AI needed, 100% client-side.",
  keywords: ["logo extractor", "isolate logo", "transparent logo maker", "image thresholding", "logo background remover", "free logo tool", "extract logo from image"],
  openGraph: {
    title: "Free Logo Extractor Tool | Isolate Logos from Images | FreeBg",
=======
  title: "Free Logo Extractor Tool | Isolate Logos from Images | PixelPro",
  description: "Isolate and extract a logo from any image with a simple background. Our threshold tool makes it easy to create a transparent PNG of your logo. No AI needed, 100% client-side.",
  keywords: ["logo extractor", "isolate logo", "transparent logo maker", "image thresholding", "logo background remover", "free logo tool", "extract logo from image"],
  openGraph: {
    title: "Free Logo Extractor Tool | Isolate Logos from Images | PixelPro",
>>>>>>> 3d22b1f70e46f9b27876a64621858138cbc3d477
    description: "Isolate and extract a logo from any image with a simple background. Our threshold tool makes it easy to create a transparent PNG of your logo. No AI needed."
  }
};

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
