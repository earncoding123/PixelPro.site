
'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { FAQ } from '@/components/faq';
import { FileUploader } from '@/components/file-uploader';
import { Card, CardContent } from '@/components/ui/card';
import { UploadCloud, Download, X, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SampleImage, SampleImagePicker } from '@/components/sample-image-picker';

const faqItems = [
    {
        question: "What do the X and Y offsets do?",
        answer: "The X (horizontal) and Y (vertical) offsets move the shadow left/right and up/down relative to your image. Positive values move it right and down; negative values move it left and up."
    },
    {
        question: "What's the difference between Blur and Spread?",
        answer: "Blur controls how soft and fuzzy the edges of the shadow are. A higher blur makes it softer. Spread makes the shadow larger or smaller in all directions without increasing the blur."
    },
    {
        question: "Why is the downloaded image a PNG?",
        answer: "We output a PNG file to ensure that the area around the shadow is transparent. This allows you to place your object and its shadow on any background without a white box around it."
    },
];

const sampleImages: SampleImage[] = [
    { url: 'https://i.postimg.cc/tR2rGvSH/Pokecut-1764076628774.png', description: 'Car' },
    { url: 'https://i.postimg.cc/9M91X9P3/person-after.png', description: 'Person' },
    { url: 'https://images.unsplash.com/photo-1611162616805-6a4066914561?w=800&q=80', description: 'Logo' },
];


export default function ShadowToolPage() {
  const [shadow, setShadow] = useState({
    x: 10,
    y: 10,
    blur: 15,
    spread: 0,
    color: '#000000',
    opacity: 50,
  });
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas before drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);


    const paddingX = Math.abs(shadow.x) + Math.abs(shadow.blur) + Math.abs(shadow.spread) + 20;
    const paddingY = Math.abs(shadow.y) + Math.abs(shadow.blur) + Math.abs(shadow.spread) + 20;

    canvas.width = image.naturalWidth + paddingX * 2;
    canvas.height = image.naturalHeight + paddingY * 2;
    
    const hexToRgb = (hex: string) => {
        let r = 0, g = 0, b = 0;
        if (hex.length === 4) {
            r = parseInt(hex[1] + hex[1], 16);
            g = parseInt(hex[2] + hex[2], 16);
            b = parseInt(hex[3] + hex[3], 16);
        } else if (hex.length === 7) {
            r = parseInt(hex.substring(1, 3), 16);
            g = parseInt(hex.substring(3, 5), 16);
            b = parseInt(hex.substring(5, 7), 16);
        }
        return { r, g, b };
    };
    
    const { r, g, b } = hexToRgb(shadow.color);
    
    ctx.shadowOffsetX = shadow.x;
    ctx.shadowOffsetY = shadow.y;
    ctx.shadowBlur = shadow.blur;
    ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${shadow.opacity / 100})`;
    
    const imageX = paddingX;
    const imageY = paddingY;

    if (shadow.spread > 0) {
        ctx.filter = `blur(${shadow.spread}px)`;
        // This is a trick to create a spread effect
        ctx.drawImage(image, imageX, imageY);
        ctx.filter = 'none';
    }

    ctx.drawImage(image, imageX, imageY);
  }, [image, shadow]);


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
    a.download = `freebg_shadow_${originalFile?.name || 'image.png'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(dataUrl);
  };

  const handleSliderChange = (name: keyof typeof shadow) => (value: number[]) => {
    setShadow(prev => ({...prev, [name]: value[0]}));
  };
  
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShadow(prev => ({...prev, color: e.target.value}));
  };

  const handleReset = () => {
    setImage(null);
    setOriginalFile(null);
  };

  const handleTrySample = async (sample: SampleImage) => {
    handleReset();
    try {
      const response = await fetch(sample.url);
      const blob = await response.blob();
      const file = new File([blob], `sample-${sample.description.toLowerCase().replace(' ','-')}.png`, { type: "image/png" });
      onFileLoad(file);
    } catch (err) {
      toast({ title: "Failed to load sample", description: "Could not fetch the sample image.", variant: "destructive"});
    }
  };
  
  return (
    <div className="space-y-16">
      <div className="relative isolate overflow-hidden bg-background px-6 py-12 text-center sm:px-16 sm:py-24" style={{backgroundImage: 'radial-gradient(at 0% 100%, hsla(212, 100%, 70%, 0.1), transparent 50%), radial-gradient(at 80% 0%, hsla(0, 0%, 50%, 0.1), transparent 50%)'}}>
        <div className="mx-auto max-w-2xl">
            <h1 className="text-3xl font-bold tracking-tight md:text-5xl font-headline">Simple Shadow Tool</h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">Add a professional drop shadow to your products, logos, or text. Customize the offset, blur, color, and more.</p>
        </div>
      </div>
      {!originalFile ? (
        <Card className="w-full max-w-3xl mx-auto">
            <CardContent className="p-4">
                <FileUploader onFileSelect={onFileLoad}>
                    <div className="text-center p-8 md:p-12">
                        <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-semibold">Upload an image to start</h3>
                        <p className="mt-1 text-sm text-muted-foreground">Preferably a PNG with a transparent background</p>
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
                      <h3 className="font-semibold text-center mb-2">Result Preview</h3>
                      <div className="w-full rounded-md overflow-hidden relative bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAACJJREFUOE9jfPbs2X8GPEBTUwOCg4MCAgJGk4iA8J8wYgMARpsA4gEAXEM3eY1hH9sAAAAASUVORK5CYII=')] bg-repeat flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
                          {image && <canvas ref={canvasRef} className="max-w-full max-h-[70vh] h-auto object-contain" />}
                      </div>
                  </CardContent>
              </Card>
          </div>
          <div className="lg:col-span-1">
              <Card>
                  <CardContent className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">Controls</h3>
                          <Button variant="ghost" size="icon" onClick={handleReset} aria-label="Start over"><X className="h-4 w-4" /></Button>
                      </div>
                      {(['x', 'y', 'blur', 'spread', 'opacity'] as const).map(key => (
                           <div key={key} className="space-y-2">
                              <div className="flex justify-between">
                                  <Label htmlFor={key} className="capitalize">{key === 'x' ? 'X Offset' : key === 'y' ? 'Y Offset' : key}</Label>
                                  <span className="text-sm font-medium">{shadow[key]}</span>
                              </div>
                              <Slider
                                  id={key}
                                  min={key === 'x' || key === 'y' ? -50 : 0}
                                  max={key === 'opacity' ? 100 : 50}
                                  step={1}
                                  value={[shadow[key]]}
                                  onValueChange={handleSliderChange(key)}
                              />
                          </div>
                       ))}
                        <div className="space-y-2">
                           <Label>Shadow Color</Label>
                           <Input type="color" value={shadow.color} onChange={handleColorChange} className="w-full h-10 p-1"/>
                        </div>
                      <Button onClick={handleDownload} disabled={!image} className="w-full">
                          <Download className="mr-2 h-4 w-4"/>
                          Download Image
                      </Button>
                  </CardContent>
              </Card>
          </div>
        </div>
      )}


       <div className="w-full max-w-6xl mx-auto space-y-12 mt-16">
        <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">Why Use Our Shadow Tool?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 border rounded-lg">
                <Zap className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Live Preview</h3>
                <p className="text-muted-foreground">Instantly see how your shadow looks as you adjust the controls. Get the perfect effect without guesswork.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 border rounded-lg">
                <ShieldCheck className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">100% Private</h3>
                <p className="text-muted-foreground">Shadow generation is done entirely in your browser. Your images are never uploaded to any server.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 border rounded-lg">
                <Sparkles className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Professional Results</h3>
                <p className="text-muted-foreground">Create realistic depth for product photos, logos, and graphics, making them stand out.</p>
            </div>
        </div>
        <section className="bg-secondary p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 font-headline text-center">How to Add a Shadow to an Image</h2>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="p-3 bg-primary/10 rounded-full mb-3 flex items-center justify-center w-12 h-12"><span className="text-2xl font-bold text-primary">1</span></div>
              <h3 className="font-semibold mb-1">Upload Your Image</h3>
              <p className="text-sm text-muted-foreground">Choose an image with a transparent background, like a logo or product shot.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-3 bg-primary/10 rounded-full mb-3 flex items-center justify-center w-12 h-12"><span className="text-2xl font-bold text-primary">2</span></div>
              <h3 className="font-semibold mb-1">Adjust Shadow Settings</h3>
              <p className="text-sm text-muted-foreground">Use the sliders to control the shadow's position (X/Y), blur, and color.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-3 bg-primary/10 rounded-full mb-3 flex items-center justify-center w-12 h-12"><span className="text-2xl font-bold text-primary">3</span></div>
              <h3 className="font-semibold mb-1">Download Your Image</h3>
              <p className="text-sm text-muted-foreground">Your image with a professional shadow is ready to download.</p>
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

    
