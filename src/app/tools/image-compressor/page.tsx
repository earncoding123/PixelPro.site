
'use client';

import { useState } from 'react';
import { ToolProcessor } from '@/components/tool-processor';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Loader2, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';
import { FAQ } from '@/components/faq';
import { useToast } from '@/hooks/use-toast';

export type ProcessResult = {
  url: string;
  originalSize: number;
  compressedSize: number;
};

const faqItems = [
    {
        question: "How does image compression work?",
        answer: "Our tool analyzes your image and reduces its file size by intelligently removing unnecessary data without significantly impacting visual quality. You can control the level of compression with the quality slider."
    },
    {
        question: "What does the 'quality' slider do?",
        answer: "The quality slider (10-95) determines the compression level. A lower number means a smaller file size but lower visual quality. A higher number results in better quality but a larger file. 85 is a good starting point for a balance of size and quality."
    },
    {
        question: "Will compressing my image make it look bad?",
        answer: "Not necessarily. Our compressor is designed to achieve the best possible quality for the selected file size. For most web uses, you can significantly reduce the file size with little to no noticeable difference in quality."
    },
];

export default function ImageCompressorPage() {
  const [quality, setQuality] = useState(85);
  const debouncedQuality = useDebounce(quality, 300);
  const { toast } = useToast();

  const processImageWithApi = async (file: File): Promise<ProcessResult> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`/api/compress-image?quality=${debouncedQuality}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to compress image');
      }

      const blob = await response.blob();
      
      const result: ProcessResult = {
        url: URL.createObjectURL(blob),
        originalSize: Number(response.headers.get('X-Original-Size') || file.size),
        compressedSize: blob.size,
      };
      
      toast({
        title: "Compression Complete!",
        description: `Image size reduced from ${result.originalSize} to ${result.compressedSize} bytes.`
      });

      return result;

    } catch (e: any) {
      console.error(e);
      toast({
        title: "Compression Failed",
        description: e.message || "An unknown error occurred.",
        variant: "destructive"
      });
      throw e;
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
              Image Compressor
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Drastically reduce image file sizes for faster websites and easier sharing, while maintaining high visual quality.
            </p>
          </div>
        </div>
      
      <ToolProcessor 
        processImage={processImageWithApi}
        sampleImageUrl='https://images.unsplash.com/photo-1552728089-57bdde3e7033?w=800&q=80'
      >
        {(isProcessing, processImage) => (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="quality">Quality</Label>
                <span className="text-sm font-medium">{quality}</span>
              </div>
              <Slider
                id="quality"
                min={10}
                max={95}
                step={1}
                value={[quality]}
                onValueChange={(value) => setQuality(value[0])}
                disabled={isProcessing}
              />
            </div>
            <Button
              onClick={processImage}
              disabled={isProcessing}
              className="w-full h-12"
            >
              {isProcessing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Compressing... </>: 'Compress Image'}
            </Button>
          </div>
        )}
      </ToolProcessor>

      <div className="w-full max-w-6xl mx-auto space-y-12 mt-16">
        <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">Why Use Our Image Compressor?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 border rounded-lg bg-background">
                <Zap className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Faster Websites</h3>
                <p className="text-muted-foreground">Optimized images load faster, improving user experience and SEO rankings. Shrink your images in seconds.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 border rounded-lg bg-background">
                <ShieldCheck className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Secure Processing</h3>
                <p className="text-muted-foreground">Your images are processed via a secure API and are never stored on our servers, ensuring your data is safe.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 border rounded-lg bg-background">
                <Sparkles className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Quality Control</h3>
                <p className="text-muted-foreground">Use the quality slider to find the perfect balance between file size and visual fidelity for your specific needs.</p>
            </div>
        </div>

        <section className="bg-background p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 font-headline text-center">How to Compress Your Images</h2>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="p-3 bg-primary/10 rounded-full mb-3 flex items-center justify-center w-12 h-12"><span className="text-2xl font-bold text-primary">1</span></div>
              <h3 className="font-semibold mb-1">Upload Your Image</h3>
              <p className="text-sm text-muted-foreground">Select a large image file (JPG, PNG, etc.) that you want to make smaller.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-3 bg-primary/10 rounded-full mb-3 flex items-center justify-center w-12 h-12"><span className="text-2xl font-bold text-primary">2</span></div>
              <h3 className="font-semibold mb-1">Adjust Quality</h3>
              <p className="text-sm text-muted-foreground">Use the slider to choose a quality level. Lower quality means a smaller file size.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-3 bg-primary/10 rounded-full mb-3 flex items-center justify-center w-12 h-12"><span className="text-2xl font-bold text-primary">3</span></div>
              <h3 className="font-semibold mb-1">Compress & Download</h3>
              <p className="text-sm text-muted-foreground">Click 'Compress' and our tool will shrink the file. See the savings and download your optimized image.</p>
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


    