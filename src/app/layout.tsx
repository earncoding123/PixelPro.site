import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import { DM_Sans, Inter } from 'next/font/google';

const fontHeadline = DM_Sans({
  subsets: ['latin'],
  variable: '--font-headline',
  weight: ['400', '500', '700'],
});

const fontBody = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: 'PixelPro - AI Image Editor',
  description: 'A suite of AI-powered image editing tools including background removal, compression, upscaling, and more.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body 
        className={cn(
          'font-body antialiased flex flex-col min-h-screen bg-secondary',
          fontHeadline.variable,
          fontBody.variable
        )}
      >
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
