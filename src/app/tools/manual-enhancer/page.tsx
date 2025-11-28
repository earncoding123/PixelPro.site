
'use client';
import { useState, useCallback, useEffect, useRef } from 'react';
import { ToolProcessor } from '@/components/tool-processor';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { FAQ } from '@/components/faq';
import { Sparkles, ShieldCheck, Zap, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Enhancement = {
  brightness: number;
  contrast: number;
  saturation: number;
  grayscale: number;
  sepia: number;
};

const faqItems = [
    {
        question: "What do the different sliders do?",
        answer: "Brightness adjusts the overall lightness or darkness. Contrast changes the difference between light and dark areas. Saturation controls the intensity of colors. Grayscale converts the image to shades of gray, and Sepia adds a warm, brownish tone."
    },
    {
        question: "Can I reset the changes?",
        answer: "Yes. To reset all sliders to their default values and revert to the original image, simply upload the image again or refresh the page."
    },
    {
        question: "Is this tool a full photo editor?",
        answer: "This is a basic image enhancer for quick adjustments. It's perfect for fine-tuning your photos, but for more complex tasks like adding text or layers, you would need more advanced software. Our goal is to provide simple, powerful tools for common editing needs."
    },
];

const DEFAULT_ENHANCEMENTS: Enhancement = {
    brightness: 100,
    contrast: 100,
    saturation: 100,
    grayscale: 0,
    sepia: 0,
};

export default function ManualEnhancerPage() {
  const [enhancements, setEnhancements] = useState<Enhancement>(DEFAULT_ENHANCEMENTS);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!imageRef.current) return;
    const filters = `
      brightness(${enhancements.brightness}%) 
      contrast(${enhancements.contrast}%) 
      saturate(${enhancements.saturation}%)
      grayscale(${enhancements.grayscale}%)
      sepia(${enhancements.sepia}%)
    `;
    imageRef.current.style.filter = filters;
  }, [enhancements]);

  const onFileLoad = (file: File) => {
    setEnhancements(DEFAULT_ENHANCEMENTS);
    const img = new window.Image();
    img.onload = () => {
      setImage(img);
    };
    img.src = URL.createObjectURL(file);
  };

  const handleSliderChange = (name: keyof Enhancement) => (value: number[]) => {
    setEnhancements(prev => ({ ...prev, [name]: value[0] }));
  };

  const processImageManually = useCallback(async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          return reject(new Error('Could not get canvas context.'));
        }

        canvas.width = img.width;
        canvas.height = img.height;
        
        ctx.filter = `
          brightness(${enhancements.brightness}%) 
          contrast(${enhancements.contrast}%) 
          saturate(${enhancements.saturation}%)
          grayscale(${enhancements.grayscale}%)
          sepia(${enhancements.sepia}%)
        `;
        
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(img.src);
        
        const mimeType = file.type.startsWith('image/') ? file.type : 'image/png';
        const dataUrl = canvas.toDataURL(mimeType);
        
        resolve(dataUrl);
      };

      img.onerror = () => {
        reject(new Error('Failed to load image.'));
      };

      img.src = URL.createObjectURL(file);
    });
  }, [enhancements]);
  
  return (
    <div className="space-y-16">
      <div className="relative isolate overflow-hidden bg-background px-6 py-12 text-center sm:px-16 sm:py-24">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),white)] dark:bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.900),theme(colors.slate.900))] opacity-20"></div>
          <div className="absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 transform-gpu overflow-hidden opacity-30 blur-3xl" aria-hidden="true">
            <div className="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
          </div>
        <div className="mx-auto max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight md:text-5xl font-headline">
            Manual Image Enhancer
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Take full control of your photo's appearance. Adjust sliders for brightness, contrast, saturation, and more with a real-time preview.
          </p>
        </div>
      </div>

      <ToolProcessor 
        processImage={processImageManually} 
        onFileSelect={onFileLoad}
        showResultPreview={true}
        sampleImageUrl='https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?w=800&q=80&sat=-100'
        customPreview={image && (
          <img 
            ref={imageRef} 
            src={image.src} 
            alt="Enhanced preview" 
            className="max-h-full max-w-full object-contain"
          />
        )}
      >
        {(isProcessing, process) => {
          return (
            <div className="space-y-4">
              {(Object.keys(enhancements) as Array<keyof Enhancement>).map((key) => (
                <div key={key} className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor={key} className="capitalize">{key}</Label>
                    <span className="text-sm font-medium">{enhancements[key]}</span>
                  </div>
                  <Slider
                    id={key}
                    min={0}
                    max={key === 'grayscale' || key === 'sepia' ? 100 : 200}
                    step={1}
                    value={[enhancements[key]]}
                    onValueChange={handleSliderChange(key)}
                    disabled={isProcessing}
                  />
                </div>
              ))}
              <Button onClick={process} disabled={isProcessing} className="w-full !mt-6 h-12">
                {isProcessing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enhancing...</> : 'Enhance Image'}
              </Button>
            </div>
          );
        }}
      </ToolProcessor>

      <div className="w-full max-w-6xl mx-auto space-y-12 mt-16">
        <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">Why Use Our Image Enhancer?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 border rounded-lg">
                <Zap className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Real-Time Preview</h3>
                <p className="text-muted-foreground">See your edits live as you move the sliders. No need to wait for processing to see the result.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 border rounded-lg">
                <ShieldCheck className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">100% Private</h3>
                <p className="text-muted-foreground">All image enhancement happens directly in your browser. Your photos are never uploaded to a server.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 border rounded-lg">
                <Sparkles className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Full Creative Control</h3>
                <p className="text-muted-foreground">Go beyond filters. Fine-tune brightness, contrast, and colors to achieve the exact look you want.</p>
            </div>
        </div>

        <section className="bg-secondary p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 font-headline text-center">How to Use the Image Enhancer</h2>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="p-3 bg-primary/10 rounded-full mb-3 flex items-center justify-center w-12 h-12"><span className="text-2xl font-bold text-primary">1</span></div>
              <h3 className="font-semibold mb-1">Upload Your Photo</h3>
              <p className="text-sm text-muted-foreground">Select the image you want to adjust from your device.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-3 bg-primary/10 rounded-full mb-3 flex items-center justify-center w-12 h-12"><span className="text-2xl font-bold text-primary">2</span></div>
              <h3 className="font-semibold mb-1">Adjust the Sliders</h3>
              <p className="text-sm text-muted-foreground">Move the sliders for brightness, contrast, and other settings to get your desired look.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-3 bg-primary/10 rounded-full mb-3 flex items-center justify-center w-12 h-12"><span className="text-2xl font-bold text-primary">3</span></div>
              <h3 className="font-semibold mb-1">Download Your Photo</h3>
              <p className="text-sm text-muted-foreground">Your enhanced photo is ready to download instantly with a single click.</p>
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
