import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Free Image Resizer | Resize Photos Online | FreeBg",
  description: "Change image dimensions in pixels with our free online image resizer. A fast, easy tool for resizing photos and pictures for any use case, directly in your browser.",
  keywords: ["image resizer", "resize image", "photo resizer", "free image resizing", "online resizer", "pixel editor"],
};

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
