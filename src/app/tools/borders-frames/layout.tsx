import type { Metadata } from 'next';

export const metadata: Metadata = {
<<<<<<< HEAD
  title: "Free Image Border & Frame Tool | Add Frames to Photos | FreeBg",
  description: "Easily add borders and frames to your photos. Customize border thickness, color, and apply styles like rounded corners or drop shadows. All done in your browser.",
  keywords: ["image border tool", "add frame to photo", "photo frame editor", "rounded corners image", "drop shadow effect", "free photo editor", "client-side image editing"],
  openGraph: {
    title: "Free Image Border & Frame Tool | Add Frames to Photos | FreeBg",
=======
  title: "Free Image Border & Frame Tool | Add Frames to Photos | PixelPro",
  description: "Easily add borders and frames to your photos. Customize border thickness, color, and apply styles like rounded corners or drop shadows. All done in your browser.",
  keywords: ["image border tool", "add frame to photo", "photo frame editor", "rounded corners image", "drop shadow effect", "free photo editor", "client-side image editing"],
  openGraph: {
    title: "Free Image Border & Frame Tool | Add Frames to Photos | PixelPro",
>>>>>>> 3d22b1f70e46f9b27876a64621858138cbc3d477
    description: "Easily add borders and frames to your photos. Customize border thickness, color, and apply styles like rounded corners or drop shadows. All done in your browser."
  }
};

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
