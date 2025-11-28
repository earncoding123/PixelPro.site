import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Free Manual Image Enhancer | Adjust Brightness, Contrast | FreeBg",
  description: "Take full control of your photo's appearance. Adjust sliders for brightness, contrast, saturation, and more with a real-time preview. All in your browser, no server upload.",
  keywords: ["image enhancer", "photo editor", "adjust brightness", "contrast saturation", "free photo editor", "manual image enhancement", "client-side photo editing"],
  openGraph: {
    title: "Free Manual Image Enhancer | Adjust Brightness, Contrast | FreeBg",
    description: "Take full control of your photo's appearance. Adjust sliders for brightness, contrast, saturation, and more with a real-time preview. All in your browser."
  }
};

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
