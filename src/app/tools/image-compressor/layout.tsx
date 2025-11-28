import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Free Image Compressor | Reduce Image File Size | FreeBg",
  description: "Drastically reduce image file sizes for faster websites and easier sharing, while maintaining high visual quality. Free to use with our online tool.",
  keywords: ["image compressor", "compress image", "reduce image size", "image optimizer", "free image compression"],
};

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
