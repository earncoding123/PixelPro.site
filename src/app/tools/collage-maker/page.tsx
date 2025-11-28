
'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { FAQ } from '@/components/faq';
import { FileUploader } from '@/components/file-uploader';
import Image from 'next/image';
import { X, UploadCloud, Download, Sparkles, ShieldCheck, Zap, RotateCw, FlipHorizontal } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { SampleImage, SampleImagePicker } from '@/components/sample-image-picker';
import { CollageLayoutPicker, type Layout, layouts } from '@/components/ui/collage-layout-picker';
import { Input } from '@/components/ui/input';

const faqItems = [
    {
        question: "How many images can I add to a collage?",
        answer: "You can add up to the number of slots available in the selected layout. If you upload more images than the layout supports, only the first few will be used."
    },
    {
        question: "How do I reorder the images in the collage?",
        answer: "Simply drag and drop the small preview thumbnails at the bottom of the collage canvas to reorder them. The collage will update instantly."
    },
    {
        question: "What do the spacing and corner radius sliders do?",
        answer: "The 'Spacing' slider controls the size of the gap between the images in the grid. The 'Corner Radius' slider lets you make the corners of each image in the collage rounded for a softer look."
    },
     {
        question: "Can I change the color of the border/spacing?",
        answer: "Yes! Use the color picker in the control panel to select any color you like for the spacing between your images."
    },
];

const sampleImages: SampleImage[] = [
    { url: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=400&q=80', description: 'Cat 1' },
    { url: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=400&q=80', description: 'Cat 2' },
    { url: 'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=400&q=80', description: 'Cat 3' },
    { url: 'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=400&q=80', description: 'Cat 4' },
];

type ImageState = {
    file: File;
    rotation: number;
    flip: boolean;
};

export default function CollageMakerPage() {
  const [images, setImages] = useState<ImageState[]>([]);
  const [layout, setLayout] = useState<Layout>(layouts[4]); // Default to 4-grid
  const [spacing, setSpacing] = useState(10);
  const [cornerRadius, setCornerRadius] = useState(0);
  const [borderColor, setBorderColor] = useState('#ffffff');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const handleFilesSelect = (files: File | File[]) => {
    const fileList = Array.isArray(files) ? files : [files];
    const newImages = fileList.map(file => ({ file, rotation: 0, flip: false }));

    setImages(prev => {
        const combined = [...prev, ...newImages];
        if (combined.length > layout.slots) {
            toast({ title: "Image limit reached", description: `This layout supports ${layout.slots} images. Some images were not added.`, variant: "default" });
            return combined.slice(0, layout.slots);
        }
        return combined;
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleImageAction = (index: number, action: 'rotate' | 'flip') => {
      setImages(prev => prev.map((img, i) => {
          if (i === index) {
              if (action === 'rotate') return { ...img, rotation: (img.rotation + 90) % 360 };
              if (action === 'flip') return { ...img, flip: !img.flip };
          }
          return img;
      }));
  }
  
  const drawCollage = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const canvasWidth = 1200;
    const canvasHeight = 1200;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Fill background with border color
    ctx.fillStyle = borderColor;
    ctx.fillRect(0,0, canvas.width, canvas.height);
    
    if (images.length === 0) {
        ctx.clearRect(0,0,canvas.width, canvas.height);
        return;
    }
    
    const loadedImages: (HTMLImageElement | null)[] = await Promise.all(
        images.slice(0, layout.slots).map(imgState => new Promise((resolve) => {
            const img = new window.Image();
            img.onload = () => resolve(img);
            img.onerror = () => resolve(null); // Resolve with null on error
            img.src = URL.createObjectURL(imgState.file);
        }))
    );

    const drawRoundedImage = (img: HTMLImageElement, state: ImageState, x: number, y: number, w: number, h: number) => {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x + cornerRadius, y);
        ctx.lineTo(x + w - cornerRadius, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + cornerRadius);
        ctx.lineTo(x + w, y + h - cornerRadius);
        ctx.quadraticCurveTo(x + w, y + h, x + w - cornerRadius, y + h);
        ctx.lineTo(x + cornerRadius, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - cornerRadius);
        ctx.lineTo(x, y + cornerRadius);
        ctx.quadraticCurveTo(x, y, x + cornerRadius, y);
        ctx.closePath();
        ctx.clip();
        
        const imgRatio = img.width / img.height;
        const tileRatio = w / h;
        let sx, sy, sWidth, sHeight;
        if (imgRatio > tileRatio) {
            sHeight = img.height;
            sWidth = sHeight * tileRatio;
            sx = (img.width - sWidth) / 2;
            sy = 0;
        } else {
            sWidth = img.width;
            sHeight = sWidth / tileRatio;
            sx = 0;
            sy = (img.height - sHeight) / 2;
        }

        ctx.translate(x + w / 2, y + h / 2);
        if(state.flip) ctx.scale(-1, 1);
        ctx.rotate(state.rotation * Math.PI / 180);
        ctx.drawImage(img, sx, sy, sWidth, sHeight, -w/2, -h/2, w, h);
        ctx.restore();
    }
    
    const s = spacing;
    const rects = layout.getRects(canvasWidth, canvasHeight, s);
    
    loadedImages.forEach((img, i) => {
        if(img && rects[i]) {
             drawRoundedImage(img, images[i], rects[i].x, rects[i].y, rects[i].w, rects[i].h);
        }
    });
    
  }, [images, layout, spacing, cornerRadius, borderColor]);

  useEffect(() => {
    drawCollage();
  }, [drawCollage]);

  const handleDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null) {
      const newImages = [...images];
      const draggedItemContent = newImages.splice(dragItem.current, 1)[0];
      newImages.splice(dragOverItem.current, 0, draggedItemContent);
      dragItem.current = null;
      dragOverItem.current = null;
      setImages(newImages);
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'pixelpro-collage.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(dataUrl);
  };
  
  const handleReset = () => {
    setImages([]);
  }

  const handleTrySample = async (sample: SampleImage) => {
    try {
        const response = await fetch(sample.url);
        const blob = await response.blob();
        const file = new File([blob], `sample-${sample.description.toLowerCase().replace(' ', '-')}.jpg`, { type: "image/jpeg" });
        handleFilesSelect([file]);
    } catch (err) {
      toast({ title: "Failed to load sample", description: "Could not fetch the sample image.", variant: "destructive"});
    }
  };

  return (
    <div className="space-y-16">
      <div className="relative isolate overflow-hidden bg-background px-6 py-12 text-center sm:px-16 sm:py-24" style={{backgroundImage: 'radial-gradient(at 20% 100%, hsla(212, 100%, 70%, 0.1), transparent 50%), radial-gradient(at 80% 0%, hsla(28, 100%, 70%, 0.1), transparent 50%)'}}>
        <div className="mx-auto max-w-2xl">
            <h1 className="text-3xl font-bold tracking-tight md:text-5xl font-headline">Collage Maker</h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">Combine your favorite photos into a beautiful story. Choose a layout, customize spacing, and create the perfect collage.</p>
        </div>
      </div>
      
      {images.length === 0 ? (
        <Card className="w-full max-w-3xl mx-auto">
            <CardContent className="p-4">
                <FileUploader onFileSelect={handleFilesSelect} multiple={true}>
                    <div className="text-center p-8 md:p-12">
                        <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-semibold">Upload images to start</h3>
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
                        <h3 className="font-semibold text-center mb-2">Collage Preview</h3>
                         <div className="aspect-square w-full rounded-md overflow-hidden relative bg-muted flex items-center justify-center">
                            <canvas ref={canvasRef} className="max-w-full max-h-full object-contain" />
                        </div>
                         <div className="flex flex-wrap gap-2 mt-4">
                            {images.map((imgState, i) => (
                                 <div 
                                    key={i} 
                                    className="relative w-16 h-16 sm:w-24 sm:h-24 group cursor-grab"
                                    draggable
                                    onDragStart={() => dragItem.current = i}
                                    onDragEnter={() => dragOverItem.current = i}
                                    onDragEnd={handleDragEnd}
                                    onDragOver={(e) => e.preventDefault()}
                                >
                                    <Image src={URL.createObjectURL(imgState.file)} alt={`upload ${i}`} layout="fill" objectFit="cover" className="rounded-md" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                                        <Button variant="ghost" size="icon" className="h-6 w-6 text-white" onClick={() => handleImageAction(i, 'rotate')}><RotateCw className="h-4 w-4"/></Button>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 text-white" onClick={() => handleImageAction(i, 'flip')}><FlipHorizontal className="h-4 w-4"/></Button>
                                    </div>
                                    <Button variant="destructive" size="icon" className="absolute -top-2 -right-2 h-6 w-6 rounded-full" onClick={() => removeImage(i)}><X className="h-4 w-4"/></Button>
                                </div>
                            ))}
                            {images.length < layout.slots && (
                                <FileUploader onFileSelect={handleFilesSelect} multiple={true} className="w-16 h-16 sm:w-24 sm:h-24">
                                    <div className="flex flex-col items-center justify-center h-full text-center p-2">
                                        <UploadCloud className="h-6 w-6 text-muted-foreground"/>
                                        <span className="text-xs text-muted-foreground mt-1">Add Image</span>
                                    </div>
                                </FileUploader>
                            )}
                         </div>
                    </CardContent>
                 </Card>
            </div>
            <div className="lg:col-span-4">
                <Card>
                    <CardContent className="p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Controls</h3>
                            {images.length > 0 && <Button variant="ghost" size="icon" onClick={handleReset} aria-label="Start over"><X className="h-4 w-4" /></Button>}
                        </div>

                        <div className="space-y-2">
                            <Label>Layout</Label>
                             <CollageLayoutPicker
                                selectedLayout={layout}
                                onSelectLayout={setLayout}
                            />
                        </div>
                         <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label>Spacing</Label>
                              <span className="text-sm font-medium">{spacing}px</span>
                            </div>
                            <Slider value={[spacing]} onValueChange={(v) => setSpacing(v[0])} max={50} />
                        </div>
                        <div className="space-y-2">
                             <div className="flex justify-between">
                              <Label>Corner Radius</Label>
                              <span className="text-sm font-medium">{cornerRadius}px</span>
                            </div>
                            <Slider value={[cornerRadius]} onValueChange={(v) => setCornerRadius(v[0])} max={100} />
                        </div>
                        <div className="space-y-2">
                           <Label>Border Color</Label>
                           <div className="flex items-center gap-2">
                                <Input type="color" value={borderColor} onChange={e => setBorderColor(e.target.value)} className="p-1 h-10 w-12 rounded-full"/>
                                <Input type="text" value={borderColor} onChange={(e) => setBorderColor(e.target.value)} placeholder="#ffffff" />
                           </div>
                        </div>
                        <Button onClick={handleDownload} disabled={images.length === 0} className="w-full">
                            <Download className="mr-2 h-4 w-4"/>
                            Download Collage
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
      )}

       <div className="w-full max-w-6xl mx-auto space-y-12 mt-16">
        <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">Why Use Our Collage Maker?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 border rounded-lg">
                <Zap className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Instant Preview</h3>
                <p className="text-muted-foreground">Watch your collage come to life as you upload images, change layouts, and adjust settings in real-time.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 border rounded-lg">
                <ShieldCheck className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
                <p className="text-muted-foreground">All processing happens in your browser. Your cherished photos are never uploaded to a server.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 border rounded-lg">
                <Sparkles className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Simple & Flexible</h3>
                <p className="text-muted-foreground">Choose from multiple layouts, and fine-tune spacing and corners to create a truly custom design.</p>
            </div>
        </div>

        <section className="bg-secondary p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 font-headline text-center">How to Make a Photo Collage</h2>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="p-3 bg-primary/10 rounded-full mb-3 flex items-center justify-center w-12 h-12"><span className="text-2xl font-bold text-primary">1</span></div>
              <h3 className="font-semibold mb-1">Upload Your Photos</h3>
              <p className="text-sm text-muted-foreground">Click the upload box to add up to 4 images for your collage.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-3 bg-primary/10 rounded-full mb-3 flex items-center justify-center w-12 h-12"><span className="text-2xl font-bold text-primary">2</span></div>
              <h3 className="font-semibold mb-1">Customize Your Layout</h3>
              <p className="text-sm text-muted-foreground">Choose a grid layout, and adjust the spacing and corner radius to your liking.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-3 bg-primary/10 rounded-full mb-3 flex items-center justify-center w-12 h-12"><span className="text-2xl font-bold text-primary">3</span></div>
              <h3 className="font-semibold mb-1">Download Your Collage</h3>
              <p className="text-sm text-muted-foreground">Your collage is generated in real-time. Just click download when you're ready.</p>
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
