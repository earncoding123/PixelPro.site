
'use client';

import { ToolProcessor } from '@/components/tool-processor';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { FAQ } from '@/components/faq';

const faqItems = [
    {
        question: "How does the AI Upscaler work?",
        answer: "Our tool uses a powerful AI model called Real-ESRGAN to intelligently add detail and increase the resolution of your image. It 'imagines' what the missing pixels should look like, resulting in a larger and clearer photo than traditional resizing."
    },
    {
        question: "What is the maximum upscale resolution?",
        answer: "The AI upscaler increases your image's resolution by 4 times (4x). For example, a 500x500 pixel image will become a 2000x2000 pixel image."
    },
    {
        question: "Why does upscaling take longer than other tools?",
        answer: "High-quality AI upscaling is a computationally intensive process. The AI needs significant processing power to analyze and reconstruct your image, which can take up to a minute. We appreciate your patience!"
    },
    {
        question: "Can I convert a black and white photo to HD?",
        answer: "Yes, our tool works as a black and white to HD photo converter. The AI will enhance the details and resolution of your monochrome images, making them crisp and clear."
    },
];

export default function AiUpscalerPage() {
  const processImageWithApi = async (file: File): Promise<string> => {
    // Safety Check from Documentation
    if (file.size > 2 * 1024 * 1024) { 
      throw new Error("File too large. Please use an image under 2MB for the best results.");
    }

    const formData = new FormData();
    formData.append('file', file);

    const API_URL = "https://earncoding-light-image-upscaler-api.hf.space/upscale";
    const API_KEY = "123Lock.on";

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'X-API-Key': API_KEY, 
        },
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 503) {
          throw new Error("The AI model is waking up from sleep. Please wait about 30 seconds and try again.");
        }
        if (response.status === 504) {
          throw new Error("The image took too long to process. This can happen with larger images. Please try a smaller one.");
        }

        const errorText = await response.text();
        let errorMessage = `Server Error (${response.status})`;
        try {
          // Try to parse Python/FastAPI error details
          const json = JSON.parse(errorText);
          if (json.detail) errorMessage = json.detail;
        } catch (e) {
          // The error is not JSON. Use the raw text if it's short and informative.
          if (errorText && errorText.length < 200) {
             errorMessage = errorText;
          }
        }
        throw new Error(errorMessage);
      }

      const imageBlob = await response.blob();
      return URL.createObjectURL(imageBlob);

    } catch (err: any) {
      console.error("Upscale Error:", err);
      // Re-throw a clean error message for the user UI
      throw new Error(err.message || "Failed to connect to the upscaling service. Please try again later.");
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
                AI Image Upscaler
                </h1>
                <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Turn low-resolution images into sharp, high-definition masterpieces. Enlarge photos by 4x and recover details for free.
                </p>
            </div>
        </div>

      <ToolProcessor processImage={processImageWithApi} sampleImageUrl='https://i.postimg.cc/Y9kC4Yj1/upscale-before.png'>
        {(isProcessing, processImage) => (
          <div className="space-y-4">
             <p className="text-sm text-muted-foreground">
              Ready to enhance your image? Click the button to start. Note: Upscaling can take up to 60 seconds.
             </p>
             <Button
                onClick={processImage}
                disabled={isProcessing}
                className="w-full h-12"
              >
                {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isProcessing ? 'Upscaling...' : 'Upscale Image'}
              </Button>
          </div>
        )}
      </ToolProcessor>

      <div className="w-full max-w-6xl mx-auto space-y-12 mt-16">
        <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">Why Use Our AI Upscaler?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 border rounded-lg bg-background">
                <Zap className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Enhance Resolution</h3>
                <p className="text-muted-foreground">Increase your image's width and height by 400% without the usual blurriness of traditional resizing.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 border rounded-lg bg-background">
                <ShieldCheck className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Secure Processing</h3>
                <p className="text-muted-foreground">Your images are processed via a secure API and are never stored. Your privacy is our priority.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 border rounded-lg bg-background">
                <Sparkles className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Recover Details</h3>
                <p className="text-muted-foreground">The AI model intelligently adds new details, reduces noise, and sharpens edges for a crystal-clear result.</p>
            </div>
        </div>

        <section className="bg-background p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 font-headline text-center">How to Use the Free AI Image Upscaler</h2>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="p-3 bg-primary/10 rounded-full mb-3 flex items-center justify-center w-12 h-12"><span className="text-2xl font-bold text-primary">1</span></div>
              <h3 className="font-semibold mb-1">Upload Your Image</h3>
              <p className="text-sm text-muted-foreground">Select a low-resolution photo, drawing, or even a black and white image.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-3 bg-primary/10 rounded-full mb-3 flex items-center justify-center w-12 h-12"><span className="text-2xl font-bold text-primary">2</span></div>
              <h3 className="font-semibold mb-1">Start AI Upscaling</h3>
              <p className="text-sm text-muted-foreground">Click 'Upscale Image'. Our AI will analyze and enhance your photo, which can take up to a minute.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-3 bg-primary/10 rounded-full mb-3 flex items-center justify-center w-12 h-12"><span className="text-2xl font-bold text-primary">3</span></div>
              <h3 className="font-semibold mb-1">Download HD Version</h3>
              <p className="text-sm text-muted-foreground">Your new high-definition image is ready! Download the upscaled version for free.</p>
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
