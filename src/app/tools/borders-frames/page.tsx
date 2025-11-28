
'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { FAQ } from '@/components/faq';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileUploader } from '@/components/file-uploader';
import { UploadCloud, Download, X, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { SampleImagePicker, SampleImage } from '@/components/sample-image-picker';


type FrameType = 'none' | 'simple' | 'rounded' | 'shadow';

const faqItems = [
    {
        question: "How do I choose a custom border color?",
        answer: "Click on the colored square next to the border color hex code. This will open a color picker where you can select any color you like. You can also type a hex code directly into the input field."
    },
    {
        question: "What's the difference between a border and a frame?",
        answer: "A border is a simple, solid line around your image. The frames add extra styling: 'Rounded' gives your image soft corners, and 'Shadow' adds a subtle drop shadow for a 3D effect."
    },
    {
        question: "What unit is the border thickness measured in?",
        answer: "The border thickness is measured in pixels. A higher number will create a thicker border around your image."
    },
];

const sampleImages: SampleImage[] = [
    { url: 'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=800&q=80', description: 'Portrait' },
    { url: 'https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=800&q=80', description: 'Dog' },
    { url: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800&q=80', description: 'Cat' },
];


export default function BordersFramesPage() {
  const [borderColor, setBorderColor] = useState('#000000');
  const [borderWidth, setBorderWidth] = useState(10);
  const [frame, setFrame] = useState<FrameType>('simple');
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();


  const drawCanvas = useCallback(() => {
    if (!image || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imgW = image.naturalWidth;
    const imgH = image.naturalHeight;
    const totalBorder = borderWidth * 2;
    const padding = frame === 'shadow' ? 40 : 0;

    canvas.width = imgW + totalBorder + padding;
    canvas.height = imgH + totalBorder + padding;
    
    ctx.clearRect(0,0, canvas.width, canvas.height);

    const canvasContentX = padding / 2;
    const canvasContentY = padding / 2;

    if (frame === 'shadow') {
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 20;
        ctx.shadowOffsetX = 10;
        ctx.shadowOffsetY = 10;
    } else {
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
    }

    if (frame !== 'none') {
        ctx.fillStyle = borderColor;
        ctx.fillRect(canvasContentX, canvasContentY, imgW + totalBorder, imgH + totalBorder);
    }
    
    const cornerRadius = frame === 'rounded' ? Math.min(30, imgW / 4, imgH / 4) : 0;

    ctx.save();
    const imageX = canvasContentX + borderWidth;
    const imageY = canvasContentY + borderWidth;
    ctx.beginPath();
    ctx.moveTo(imageX + cornerRadius, imageY);
    ctx.arcTo(imageX + imgW, imageY, imageX + imgW, imageY + imgH, cornerRadius);
    ctx.arcTo(imageX + imgW, imageY + imgH, imageX, imageY + imgH, cornerRadius);
    ctx.arcTo(imageX, imageY + imgH, imageX, imageY, cornerRadius);
    ctx.arcTo(imageX, imageY, imageX + imgW, imageY, cornerRadius);
    ctx.closePath();
    ctx.clip();
    
    ctx.drawImage(image, imageX, imageY, imgW, imgH);
    ctx.restore();
    
  }, [image, borderColor, borderWidth, frame]);

  useEffect(() => {
    if (image) {
      drawCanvas();
    }
  }, [image, borderColor, borderWidth, frame, drawCanvas]);


  const onFileLoad = (file: File) => {
    const img = new window.Image();
    img.onload = () => {
      setImage(img);
      setOriginalFile(file);
    };
    img.src = URL.createObjectURL(file);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas || !image) {
        toast({ title: "No image loaded", description: "Please upload an image first.", variant: "destructive"});
        return;
    }
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `freebg_framed_${originalFile?.name || 'image.png'}`;
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
      const file = new File([blob], `sample-${sample.description.toLowerCase()}.jpg`, { type: "image/jpeg" });
      onFileLoad(file);
    } catch (err) {
      toast({ title: "Failed to load sample", description: "Could not fetch the sample image.", variant: "destructive"});
    }
  };

  return (
    <div className="space-y-16">
      <div className="relative isolate overflow-hidden bg-background px-6 py-12 text-center sm:px-16 sm:py-24" style={{backgroundImage: 'radial-gradient(at 60% 40%, hsla(252, 100%, 70%, 0.1), transparent 50%), radial-gradient(at 80% 0%, hsla(28, 100%, 70%, 0.1), transparent 50%)'}}>
          <div className="mx-auto max-w-2xl">
              <h1 className="text-3xl font-bold tracking-tight md:text-5xl font-headline">Borders & Frames</h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">Give your photos a professional finish. Add custom borders, rounded corners, or drop shadows with ease.</p>
          </div>
      </div>
      
      {!originalFile ? (
         <Card className="w-full max-w-3xl mx-auto">
            <CardContent className="p-4">
                <FileUploader onFileSelect={onFileLoad}>
                    <div className="text-center p-8 md:p-12">
                        <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-semibold">Upload an image to get started</h3>
                        <p className="mt-1 text-sm text-muted-foreground">Drag and drop or click to browse</p>
                    </div>
                </FileUploader>
                <SampleImagePicker samples={sampleImages} onSelect={handleTrySample} />
            </CardContent>
        </Card>
      ) : (
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <Card>
                <CardContent className="p-4">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-center">Original</h3>
                        <div className="aspect-square w-full rounded-md overflow-hidden relative bg-muted flex items-center justify-center">
                            {originalFile && <Image src={URL.createObjectURL(originalFile)} alt="Original" layout="fill" objectFit="contain" />}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-semibold text-center">Result</h3>
                        <div className="aspect-square w-full rounded-md overflow-hidden relative bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAACJJREFUOE9jfPbs2X8GPEBTUwOCg4MCAgJGk4iA8J8wYgMARpsA4gEAXEM3eY1hH9sAAAAASUVORK5CYII=')] bg-repeat flex items-center justify-center">
                            <canvas ref={canvasRef} className="max-w-full max-h-full object-contain" />
                        </div>
                      </div>
                    </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-4">
              <Card className="bg-background/80 backdrop-blur-sm sticky top-24">
                <CardContent className="p-6 space-y-6">
                   <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Controls</h3>
                      <Button variant="ghost" size="icon" onClick={handleReset} aria-label="Start over"><X className="h-4 w-4" /></Button>
                  </div>
                  <div className="space-y-2">
                      <Label>Frame Style</Label>
                      <Select value={frame} onValueChange={(v) => setFrame(v as FrameType)}>
                          <SelectTrigger><SelectValue placeholder="Select a frame style" /></SelectTrigger>
                          <SelectContent>
                              <SelectItem value="none">No Frame</SelectItem>
                              <SelectItem value="simple">Simple Border</SelectItem>
                              <SelectItem value="rounded">Rounded Corners</SelectItem>
                              <SelectItem value="shadow">Drop Shadow</SelectItem>
                          </SelectContent>
                      </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="border-width">Border Thickness</Label>
                      <span className="text-sm font-medium">{borderWidth}px</span>
                    </div>
                    <Slider
                      id="border-width"
                      min={0} max={100} step={1}
                      value={[borderWidth]}
                      onValueChange={(v) => setBorderWidth(v[0])}
                    />
                  </div>
                  
                  <div className="space-y-2">
                       <Label>Border Color</Label>
                       <div className="flex items-center gap-2">
                        <Input id="color-picker" type="color" value={borderColor} onChange={e => setBorderColor(e.target.value)} className="p-1 h-10 w-12" />
                        <Input type="text" value={borderColor} onChange={e => setBorderColor(e.target.value)} />
                      </div>
                  </div>
                  
                  <Button onClick={handleDownload} disabled={!image} className="w-full h-12">
                      <Download className="mr-2 h-4 w-4" />
                      Download Image
                  </Button>
                </CardContent>
              </Card>
            </div>
        </div>
      )}


       <div className="w-full max-w-6xl mx-auto space-y-12 mt-16">
        <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">Why Use Our Border & Frame Tool?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 border rounded-lg bg-background">
                <Zap className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Live Preview</h3>
                <p className="text-muted-foreground">See your changes in real-time as you adjust settings. No guesswork needed.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 border rounded-lg bg-background">
                <ShieldCheck className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Browser-Based Privacy</h3>
                <p className="text-muted-foreground">All processing happens on your device. Your images are never uploaded to a server.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 border rounded-lg bg-background">
                <Sparkles className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Stylish Presets</h3>
                <p className="text-muted-foreground">Instantly apply professional styles like rounded corners or drop shadows with a single click.</p>
            </div>
        </div>

        <section className="bg-secondary p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 font-headline text-center">How to Add Borders and Frames</h2>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="p-3 bg-primary/10 rounded-full mb-3 flex items-center justify-center w-12 h-12"><span className="text-2xl font-bold text-primary">1</span></div>
              <h3 className="font-semibold mb-1">Upload Your Image</h3>
              <p className="text-sm text-muted-foreground">Select the photo you want to frame from your device.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-3 bg-primary/10 rounded-full mb-3 flex items-center justify-center w-12 h-12"><span className="text-2xl font-bold text-primary">2</span></div>
              <h3 className="font-semibold mb-1">Customize Your Frame</h3>
              <p className="text-sm text-muted-foreground">Choose a frame style, adjust border thickness, and pick a color.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-3 bg-primary/10 rounded-full mb-3 flex items-center justify-center w-12 h-12"><span className="text-2xl font-bold text-primary">3</span></div>
              <h3 className="font-semibold mb-1">Download Your Photo</h3>
              <p className="text-sm text-muted-foreground">Your beautifully framed photo is ready to download instantly.</p>
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

    
