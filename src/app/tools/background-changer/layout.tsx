import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Free AI Background Changer | Replace Image Backgrounds | FreeBg",
  description: "Instantly change the background of any photo with our free AI-powered tool. Replace it with a solid color or a new image. Client-side for privacy.",
  keywords: ["background changer", "replace image background", "photo background editor", "free background changer", "ai background replacement"],
};

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
