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

const siteUrl = 'https://freebg.site';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Free Background Remover - Instantly Create Transparent Backgrounds | FreeBg',
  description: 'The easiest way to remove backgrounds from images for free. Get a high-quality transparent background (PNG) in seconds with our AI tool. No account required.',
  keywords: ['background remover', 'remove background', 'transparent background', 'free background remover', 'image background removal', 'png maker', 'online photo editor', 'cutout image', 'AI background removal', 'freebg'],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Free Background Remover - Instantly Create Transparent Backgrounds | FreeBg',
    description: 'Get a high-quality transparent background (PNG) in seconds with our free AI tool.',
    url: siteUrl,
    siteName: 'FreeBg',
    images: [
      {
        url: `${siteUrl}/og-image.png`, // You should create this image and place it in the /public folder
        width: 1200,
        height: 630,
        alt: 'A demonstration of the FreeBg background remover tool.',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Background Remover by FreeBg',
    description: 'Instantly remove image backgrounds for free. Get a transparent PNG in one click.',
    images: [`${siteUrl}/twitter-image.png`], // You should create this image and place it in the /public folder
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'FreeBg - Background Remover',
  url: siteUrl,
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Any',
  description: 'A free online tool to automatically remove the background from images, creating a transparent PNG in seconds using AI.',
  featureList: [
    'Free background removal',
    'AI-powered precision',
    'Transparent PNG output',
    'No account required',
    'Instant results',
  ],
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
       <head>
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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
