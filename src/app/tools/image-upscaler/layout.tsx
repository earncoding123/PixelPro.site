import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Free AI Image Upscaler | Enlarge & Enhance Photos | PixelPro",
  description: "Turn low-resolution images into sharp, high-definition masterpieces with our free AI upscaler. Enlarge photos by 4x and recover details instantly.",
  keywords: ["image upscaler", "ai image enhancer", "enlarge photo", "increase image resolution", "hd photo converter", "free upscaler"],
};

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
