import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Free Meme Generator | Create Memes Online | FreeBg",
  description: "Become an internet legend with our free meme generator. Add classic meme text to any image, customize fonts, and share your creation. All done in your browser for privacy.",
  keywords: ["meme generator", "create meme", "free meme maker", "add text to image", "online meme editor", "impact font meme", "client-side meme tool"],
  openGraph: {
    title: "Free Meme Generator | Create Memes Online | FreeBg",
    description: "Become an internet legend with our free meme generator. Add classic meme text to any image, customize fonts, and share your creation. All done in your browser."
  }
};

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
