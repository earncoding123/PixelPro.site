
'use client';

import { useState } from 'react';
import { ToolProcessor } from '@/components/tool-processor';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { FAQ } from '@/components/faq';
import { Sparkles, ShieldCheck, Zap, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Format = 'jpeg' | 'png' | 'webp';

const faqItems = [
    {
        question: "What's the difference between JPG, PNG, and WebP?",
        answer: "JPG is best for photos and has small file sizes but doesn't support transparency. PNG supports transparency and is high quality, but files are larger. WebP is a modern format with excellent compression and transparency support, but is not yet supported everywhere."
    },
    {
        question: "When should I use the 'Quality' slider?",
        answer: "The quality slider applies to JPG and WebP formats. A lower quality setting results in a smaller file size, which is great for websites. A higher quality setting preserves more detail but results in a larger file."
    },
    {
        question: "Does converting an image reduce its quality?",
        answer: "Converting from a high-quality format like PNG to a 'lossy' format like JPG or low-quality WebP can reduce quality. Converting between PNG and high-quality WebP usually results in minimal quality loss."
    },
];

const sampleImages = [
    {
      url: 'https://images.unsplash.com/photo-1561023766-d35b36cb6a27?w=800&q=80',
      description: 'Chameleon'
    },
    {
      url: 'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=800&q=80',
      description: 'Cat'
    },
    {
      url: 'https://images.unsplash.com/photo-1552728089-57bdde3e7033?w=800&q=80',
      description: 'Bird'
    }
];

export default function FormatConverterPage() {
  const [format, setFormat] = useState<Format>('png');
  const [quality, setQuality] = useState(80);

  const processImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Could not get canvas context.'));
        }
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(img.src);

        const mimeType = `image/${format}`;
        const dataUrl = canvas.toDataURL(mimeType, format !== 'png' ? quality / 100 : undefined);
        resolve(dataUrl);
      };
      img.onerror = () => {
        reject(new Error('Failed to load image.'));
      };
      img.src = URL.createObjectURL(file);
    });
  };

  return (
    <div className="space-y-16">
        <div className="relative isolate overflow-hidden bg-background px-6 py-12 text-center sm:px-16 sm:py-24" style={{backgroundImage: 'radial-gradient(at 0% 0%, hsla(253, 100%, 70%, 0.1), transparent 50%), radial-gradient(at 100% 100%, hsla(339, 100%, 70%, 0.1), transparent 50%)'}}>
            <div className="mx-auto max-w-2xl">
                <h1 className="text-3xl font-bold tracking-tight md:text-5xl font-headline">Image Format Converter</h1>
                <p className="mt-6 text-lg leading-8 text-muted-foreground">Instantly convert your images to JPG, PNG, or WebP. Adjust quality for the perfect balance of size and clarity.</p>
            </div>
        </div>

      <ToolProcessor 
        processImage={processImage} 
        showResultPreview={true}
        downloadFileNameSuffix={`_converted.${format.replace('jpeg','jpg')}`}
        sampleImages={sampleImages}
      >
        {(isProcessing, process) => (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Convert to</Label>
              <RadioGroup
                value={format}
                onValueChange={(value) => setFormat(value as Format)}
                className="flex space-x-2 sm:space-x-4"
                disabled={isProcessing}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="png" id="png" />
                  <Label htmlFor="png">PNG</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="jpeg" id="jpeg" />
                  <Label htmlFor="jpeg">JPG</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="webp" id="webp" />
                  <Label htmlFor="webp">WebP</Label>
                </div>
              </RadioGroup>
            </div>
            
            {(format === 'jpeg' || format === 'webp') && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="quality">Quality</Label>
                  <span className="text-sm font-medium">{quality}</span>
                </div>
                <Slider
                  id="quality"
                  min={10}
                  max={100}
                  step={5}
                  value={[quality]}
                  onValueChange={(value) => setQuality(value[0])}
                  disabled={isProcessing}
                />
              </div>
            )}
             <Button
              onClick={process}
              disabled={isProcessing}
              className="w-full h-12 !mt-6"
            >
              {isProcessing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Converting...</> : 'Convert Image'}
            </Button>
          </div>
        )}
      </ToolProcessor>

       <div className="w-full max-w-6xl mx-auto space-y-12 mt-16">
        <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">Why Use Our Format Converter?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 border rounded-lg">
                <Zap className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Instant Conversion</h3>
                <p className="text-muted-foreground">No waiting or uploads. Conversions happen instantly in your browser for a lightning-fast workflow.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 border rounded-lg">
                <ShieldCheck className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">100% Private</h3>
                <p className="text-muted-foreground">Your images are never sent to a server. All processing is done on your device, ensuring total privacy.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 border rounded-lg">
                <Sparkles className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Flexible Controls</h3>
                <p className="text-muted-foreground">Adjust the quality slider for JPG and WebP formats to get the optimal balance of file size and visual fidelity.</p>
            </div>
        </div>

        <section className="bg-secondary p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 font-headline text-center">How to Use the Image Format Converter</h2>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="p-3 bg-primary/10 rounded-full mb-3 flex items-center justify-center w-12 h-12"><span className="text-2xl font-bold text-primary">1</span></div>
              <h3 className="font-semibold mb-1">Upload Your Image</h3>
              <p className="text-sm text-muted-foreground">Select the image file you want to convert from your device.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-3 bg-primary/10 rounded-full mb-3 flex items-center justify-center w-12 h-12"><span className="text-2xl font-bold text-primary">2</span></div>
              <h3 className="font-semibold mb-1">Choose Target Format</h3>
              <p className="text-sm text-muted-foreground">Select JPG, PNG, or WebP. Adjust the quality slider if converting to JPG or WebP.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-3 bg-primary/10 rounded-full mb-3 flex items-center justify-center w-12 h-12"><span className="text-2xl font-bold text-primary">3</span></div>
              <h3 className="font-semibold mb-1">Download Image</h3>
              <p className="text-sm text-muted-foreground">Click 'Convert' then 'Download' and your new image will be saved.</p>
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
