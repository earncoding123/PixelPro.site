
'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { FAQ } from '@/components/faq';
import { FileUploader } from '@/components/file-uploader';
import { Card, CardContent } from '@/components/ui/card';
import { UploadCloud, Download, X, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { SampleImage, SampleImagePicker } from '@/components/sample-image-picker';

const faqItems = [
    {
        question: "How does the threshold slider work?",
        answer: "The threshold slider determines which pixels become transparent. As you move the slider, it sets a brightness level. Any pixel darker than that level will be kept (becoming part of the logo), and any pixel lighter than it will be made transparent."
    },
    {
        question: "Why does my extracted logo have jagged edges?",
        answer: "This method works best on images where the logo is on a solid, contrasting background. If the background is complex or has similar colors to the logo, you may see jagged edges. Adjusting the threshold slider can help you find the cleanest result."
    },
    {
        question: "Is this tool using AI?",
        answer: "No, this is a non-AI tool. It uses a classic computer vision technique called 'thresholding.' It's simple, fast, and works great for high-contrast images without needing a powerful server."
    },
];

const sampleImages: SampleImage[] = [
    { url: 'https://images.unsplash.com/photo-1611162616805-6a4066914561?w=800&q=80', description: 'YouTube Logo' },
    { url: 'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=800&q=80', description: 'Instagram Logo' },
    { url: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80', description: 'Netflix Logo' },
];

export default function LogoExtractorPage() {
  const [threshold, setThreshold] = useState(128);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    ctx.drawImage(image, 0, 0);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      if (avg > threshold) {
        data[i+3] = 0;
      } else {
        data[i] = 0;
        data[i+1] = 0;
        data[i+2] = 0;
        data[i+3] = 255;
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
  }, [image, threshold]);


  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);


  const onFileLoad = (file: File) => {
    const img = new window.Image();
    img.onload = () => setImage(img);
    img.src = URL.createObjectURL(file);
    setOriginalFile(file);
  };
  
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
<<<<<<< HEAD
    a.download = `freebg_logo_${originalFile?.name || 'image.png'}`;
=======
    a.download = `pixelpro_logo_${originalFile?.name || 'image.png'}`;
>>>>>>> 3d22b1f70e46f9b27876a64621858138cbc3d477
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(dataUrl);
  };
  
  const handleReset = () => {
      setImage(null);
      setOriginalFile(null);
  }

  const handleTrySample = async (sample: SampleImage) => {
    handleReset();
    try {
      const response = await fetch(sample.url);
      const blob = await response.blob();
      const file = new File([blob], `sample-${sample.description.toLowerCase().replace(' ','-')}.jpg`, { type: "image/jpeg" });
      onFileLoad(file);
    } catch (err) {
      toast({ title: "Failed to load sample", description: "Could not fetch the sample image.", variant: "destructive"});
    }
  };

  return (
    <div className="space-y-16">
      <div className="relative isolate overflow-hidden bg-background px-6 py-12 text-center sm:px-16 sm:py-24" style={{backgroundImage: 'radial-gradient(at 0% 100%, hsla(212, 100%, 70%, 0.1), transparent 50%), radial-gradient(at 80% 0%, hsla(28, 100%, 70%, 0.1), transparent 50%)'}}>
          <div className="mx-auto max-w-2xl">
              <h1 className="text-3xl font-bold tracking-tight md:text-5xl font-headline">Logo Extractor</h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">Isolate a logo from a simple background. This tool is perfect for grabbing a clean logo from a photo.</p>
          </div>
      </div>
      {!originalFile ? (
        <Card className="w-full max-w-3xl mx-auto">
            <CardContent className="p-4">
                <FileUploader onFileSelect={onFileLoad}>
                    <div className="text-center p-8 md:p-12">
                        <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-semibold">Upload an image to start</h3>
                        <p className="mt-1 text-sm text-muted-foreground">Best for logos on plain backgrounds</p>
                    </div>
                </FileUploader>
                <SampleImagePicker samples={sampleImages} onSelect={handleTrySample} />
            </CardContent>
        </Card>
      ) : (
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
              <Card>
                  <CardContent className="p-4">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                              <h3 className="font-semibold text-center">Original</h3>
                              <div className="aspect-square w-full rounded-md overflow-hidden relative">
                                 {originalFile && <Image src={URL.createObjectURL(originalFile)} alt="Original" layout="fill" objectFit="contain" />}
                              </div>
                          </div>
                          <div className="space-y-2">
                              <h3 className="font-semibold text-center">Result</h3>
                              <div className="aspect-square w-full rounded-md overflow-hidden relative bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAACJJREFUOE9jfPbs2X8GPEBTUwOCg4MCAgJGk4iA8J8wYgMARpsA4gEAXEM3eY1hH9sAAAAASUVORK5CYII=')] bg-repeat flex items-center justify-center">
                                 {image && <canvas ref={canvasRef} className="max-w-full max-h-full object-contain" />}
                              </div>
                          </div>
                      </div>
                  </CardContent>
              </Card>
          </div>
          <div className="lg:col-span-1">
              <Card>
                  <CardContent className="p-6 space-y-6">
                      <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">Controls</h3>
                          <Button variant="ghost" size="icon" onClick={handleReset} aria-label="Start over"><X className="h-4 w-4" /></Button>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="threshold">Threshold</Label>
                          <span className="text-sm font-medium">{threshold}</span>
                        </div>
                        <Slider
                          id="threshold"
                          min={0}
                          max={255}
                          step={1}
                          value={[threshold]}
                          onValueChange={(value) => setThreshold(value[0])}
                        />
                      </div>
                      <Button
                        onClick={handleDownload}
                        disabled={!image}
                        className="w-full"
                      >
                        <Download className="mr-2 h-4 w-4"/>
                        Extract & Download
                      </Button>
                  </CardContent>
              </Card>
          </div>
        </div>
      )}


       <div className="w-full max-w-6xl mx-auto space-y-12 mt-16">
        <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">Why Use Our Logo Extractor?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 border rounded-lg">
                <Zap className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Simple & Fast</h3>
                <p className="text-muted-foreground">Uses a simple but powerful thresholding method that works instantly. No AI, no waiting.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 border rounded-lg">
                <ShieldCheck className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Completely Private</h3>
                <p className="text-muted-foreground">All processing is done in your browser. Your images never leave your computer, ensuring total privacy.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 border rounded-lg">
                <Sparkles className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Transparent PNG Output</h3>
                <p className="text-muted-foreground">The result is a clean PNG file with a transparent background, perfect for use in any design project.</p>
            </div>
        </div>
        <section className="bg-secondary p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 font-headline text-center">How to Extract a Logo</h2>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="p-3 bg-primary/10 rounded-full mb-3 flex items-center justify-center w-12 h-12"><span className="text-2xl font-bold text-primary">1</span></div>
              <h3 className="font-semibold mb-1">Upload Your Image</h3>
              <p className="text-sm text-muted-foreground">Choose an image containing a logo on a relatively plain background.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-3 bg-primary/10 rounded-full mb-3 flex items-center justify-center w-12 h-12"><span className="text-2xl font-bold text-primary">2</span></div>
              <h3 className="font-semibold mb-1">Adjust Threshold</h3>
              <p className="text-sm text-muted-foreground">Move the slider until the logo is clearly visible and the background is removed.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-3 bg-primary/10 rounded-full mb-3 flex items-center justify-center w-12 h-12"><span className="text-2xl font-bold text-primary">3</span></div>
              <h3 className="font-semibold mb-1">Download Your Logo</h3>
              <p className="text-sm text-muted-foreground">Click 'Download' to get your transparent PNG logo.</p>
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

<<<<<<< HEAD
    
=======
    
>>>>>>> 3d22b1f70e46f9b27876a64621858138cbc3d477
