import type { Metadata } from 'next';

export const metadata: Metadata = {
<<<<<<< HEAD
  title: "Free Online Collage Maker | Combine Photos Easily | FreeBg",
  description: "Create beautiful photo collages in seconds with our free online collage maker. Choose from multiple layouts, customize spacing, and download your creation. Client-side processing for privacy.",
  keywords: ["collage maker", "photo collage", "combine photos", "grid layout", "free collage tool", "online photo editor", "picture collage maker"],
  openGraph: {
    title: "Free Online Collage Maker | Combine Photos Easily | FreeBg",
=======
  title: "Free Online Collage Maker | Combine Photos Easily | PixelPro",
  description: "Create beautiful photo collages in seconds with our free online collage maker. Choose from multiple layouts, customize spacing, and download your creation. Client-side processing for privacy.",
  keywords: ["collage maker", "photo collage", "combine photos", "grid layout", "free collage tool", "online photo editor", "picture collage maker"],
  openGraph: {
    title: "Free Online Collage Maker | Combine Photos Easily | PixelPro",
>>>>>>> 3d22b1f70e46f9b27876a64621858138cbc3d477
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
