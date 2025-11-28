import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Free Rotate & Flip Image Tool | Mirror & Turn Photos | PixelPro",
  description: "Correct your photo's orientation in an instant. Rotate 90 degrees or create a mirror image horizontally or vertically with a single click. Free and in your browser for privacy.",
  keywords: ["rotate image", "flip image", "mirror image", "photo rotator", "image flipper", "online image editor", "client-side rotation"],
  openGraph: {
    title: "Free Rotate & Flip Image Tool | Mirror & Turn Photos | PixelPro",
    description: "Correct your photo's orientation in an instant. Rotate 90 degrees or create a mirror image horizontally or vertically with a single click. Free and in your browser."
  }
};

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
