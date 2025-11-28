import type { Metadata } from 'next';

export const metadata: Metadata = {
<<<<<<< HEAD
  title: "Free Shadow Generator Tool | Add Drop Shadow to Images | FreeBg",
  description: "Add a professional drop shadow to your products, logos, or text. Customize the offset, blur, color, and more, then download as a transparent PNG. No server uploads.",
  keywords: ["shadow generator", "drop shadow tool", "add shadow to image", "css shadow generator", "png shadow", "image shadow editor", "client-side shadow tool"],
  openGraph: {
    title: "Free Shadow Generator Tool | Add Drop Shadow to Images | FreeBg",
=======
  title: "Free Shadow Generator Tool | Add Drop Shadow to Images | PixelPro",
  description: "Add a professional drop shadow to your products, logos, or text. Customize the offset, blur, color, and more, then download as a transparent PNG. No server uploads.",
  keywords: ["shadow generator", "drop shadow tool", "add shadow to image", "css shadow generator", "png shadow", "image shadow editor", "client-side shadow tool"],
  openGraph: {
    title: "Free Shadow Generator Tool | Add Drop Shadow to Images | PixelPro",
>>>>>>> 3d22b1f70e46f9b27876a64621858138cbc3d477
    description: "Add a professional drop shadow to your products, logos, or text. Customize the offset, blur, color, and more, then download as a transparent PNG."
  }
};

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
