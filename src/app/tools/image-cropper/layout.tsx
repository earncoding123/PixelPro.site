import type { Metadata } from 'next';

export const metadata: Metadata = {
<<<<<<< HEAD
  title: "Free Online Image Cropper | Crop Photos | FreeBg",
  description: "Trim your photos with precision using our free online image cropper. Use freeform crop or presets for social media, thumbnails, and more to get the perfect frame. Client-side for privacy.",
  keywords: ["image cropper", "crop image", "photo cropper", "free image crop tool", "online photo editor", "crop for instagram", "browser-based image crop"],
  openGraph: {
    title: "Free Online Image Cropper | Crop Photos | FreeBg",
=======
  title: "Free Online Image Cropper | Crop Photos | PixelPro",
  description: "Trim your photos with precision using our free online image cropper. Use freeform crop or presets for social media, thumbnails, and more to get the perfect frame. Client-side for privacy.",
  keywords: ["image cropper", "crop image", "photo cropper", "free image crop tool", "online photo editor", "crop for instagram", "browser-based image crop"],
  openGraph: {
    title: "Free Online Image Cropper | Crop Photos | PixelPro",
>>>>>>> 3d22b1f70e46f9b27876a64621858138cbc3d477
    description: "Trim your photos with precision using our free online image cropper. Use freeform crop or presets for social media, thumbnails, and more to get the perfect frame."
  }
};

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
