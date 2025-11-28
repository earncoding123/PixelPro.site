'use client';

import { useState } from 'react';
import { ToolProcessor } from '@/components/tool-processor';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { FAQ } from '@/components/faq';

const faqItems = [
    {
        question: "How accurate is the background removal?",
        answer: "Our AI is trained on millions of images to provide highly accurate cutouts. It works best on images with clear subjects, but can handle complex scenarios like hair and fine details with impressive precision."
    },
    {
        question: "What is a 'transparent background'?",
        answer: "A transparent background means the area around your main subject is empty. The resulting image will be a PNG file, which you can easily place on top of other images or colored backgrounds without a white box around it."
    },
    {
        question: "Can I use the removed background image for commercial purposes?",
        answer: "Yes, absolutely. The images you create are yours to use however you wish, for both personal and commercial projects. Our free bg remover is here to make your life easier."
    },
];

export default function BackgroundRemoverPage() {
  const [isApiProcessing, setIsApiProcessing] = useState(false);

  const processImageWithApi = async (file: File): Promise<string> => {
    setIsApiProcessing(true);
    try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch('/api/remove-background', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            let errorMessage = `API Error: ${response.status}`;
            try {
                const errorText = await response.text();
                // Try to parse as JSON, but fall back to raw text if it fails
                try {
                    const errorJson = JSON.parse(errorText);
                    if (errorJson.error) {
                        errorMessage = errorJson.error;
                    }
                } catch (e) {
                     if (errorText.length < 100) { // Don't show a huge HTML page
                        errorMessage = errorText;
                    } else {
                        errorMessage = `Failed to process image. The server returned an unexpected response.`;
                    }
                }
            } catch (e) {
                // This catch block handles cases where .text() itself fails
                errorMessage = `Failed to process image. The server returned an unreadable response.`;
            }
            throw new Error(errorMessage);
        }

        const blob = await response.blob();
        return URL.createObjectURL(blob);
    } finally {
        setIsApiProcessing(false);
    }
  };

  return (
    <div className="space-y-16">
       <div className="relative isolate overflow-hidden bg-background px-6 py-12 text-center sm:px-16 sm:py-24">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),white)] dark:bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.900),theme(colors.slate.900))] opacity-20"></div>
          <div className="absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 transform-gpu overflow-hidden opacity-30 blur-3xl" aria-hidden="true">
            <div className="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
          </div>
        <div className="mx-auto max-w-2xl">
            <h1 className="text-3xl font-bold tracking-tight md:text-5xl font-headline">
              AI Background Remover
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Instantly create a transparent background for any image. Our AI handles tricky edges like hair and fur with precision.
            </p>
          </div>
        </div>

      <ToolProcessor processImage={processImageWithApi} sampleImageUrl='https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80'>
        {(isProcessing, processImage) => (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Your image is ready. Click the button below to instantly remove the background.
            </p>
            <Button
              onClick={processImage}
              disabled={isProcessing || isApiProcessing}
              className="w-full h-12"
            >
              {(isProcessing || isApiProcessing) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {(isProcessing || isApiProcessing) ? 'Processing...' : 'Remove Background'}
            </Button>
          </div>
        )}
      </ToolProcessor>

      <div className="w-full max-w-6xl mx-auto space-y-12 mt-16">
        <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">Why Use Our Background Remover?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 border rounded-lg bg-background">
                <Zap className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">One-Click Simple</h3>
                <p className="text-muted-foreground">No complex tools or manual selection needed. Our AI does all the heavy lifting for you in a single click.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 border rounded-lg bg-background">
                <ShieldCheck className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Privacy Focused</h3>
                <p className="text-muted-foreground">Your images are processed via a secure API and are never stored on our servers, ensuring your data is safe.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 border rounded-lg bg-background">
                <Sparkles className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Studio Quality Cutouts</h3>
                <p className="text-muted-foreground">The AI intelligently handles complex areas like hair, fur, and fine details for a professional-grade transparent PNG.</p>
            </div>
        </div>

        <section className="bg-background p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 font-headline text-center">How to Remove a Background in 3 Seconds</h2>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="p-3 bg-primary/10 rounded-full mb-3 flex items-center justify-center w-12 h-12"><span className="text-2xl font-bold text-primary">1</span></div>
              <h3 className="font-semibold mb-1">Upload Your Image</h3>
              <p className="text-sm text-muted-foreground">Click the upload area and select a JPG, PNG, or WEBP file from your device.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-3 bg-primary/10 rounded-full mb-3 flex items-center justify-center w-12 h-12"><span className="text-2xl font-bold text-primary">2</span></div>
              <h3 className="font-semibold mb-1">Remove Background</h3>
              <p className="text-sm text-muted-foreground">Click the 'Remove Background' button and let our AI work its magic in seconds.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-3 bg-primary/10 rounded-full mb-3 flex items-center justify-center w-12 h-12"><span className="text-2xl font-bold text-primary">3</span></div>
              <h3 className="font-semibold mb-1">Download Your Image</h3>
              <p className="text-sm text-muted-foreground">Your new image with a transparent background is ready! Click 'Download' to save it for free.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 font-headline text-center">Frequently Asked Questions</h2>
          <FAQ items={faqItems} />
        </section>
      </div>
    </div>
  );
}
