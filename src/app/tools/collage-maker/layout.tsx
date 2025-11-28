import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Free Online Collage Maker | Combine Photos Easily | PixelPro",
  description: "Create beautiful photo collages in seconds with our free online collage maker. Choose from multiple layouts, customize spacing, and download your creation. Client-side processing for privacy.",
  keywords: ["collage maker", "photo collage", "combine photos", "grid layout", "free collage tool", "online photo editor", "picture collage maker"],
  openGraph: {
    title: "Free Online Collage Maker | Combine Photos Easily | PixelPro",
    description: "Create beautiful photo collages in seconds with our free online collage maker. Choose from multiple layouts, customize spacing, and download your creation."
  }
};

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
