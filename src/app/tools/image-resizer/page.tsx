
'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Sparkles, ShieldCheck, Zap, UploadCloud, Download, X, Loader2 } from 'lucide-react';
import { FAQ } from '@/components/faq';
import { AnimatePresence, motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { FileUploader } from '@/components/file-uploader';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


const faqItems = [
    {
        question: "What's the difference between resizing and cropping?",
        answer: "Resizing changes the overall dimensions (width and height) of the entire image, making it larger or smaller. Cropping, on the other hand, cuts out a part of the image, changing its composition. You can use both tools for the perfect result."
    },
    {
        question: "What does 'Maintain aspect ratio' do?",
        answer: "This option ensures that the image's proportions are preserved. When you change the width, the height will automatically adjust to prevent the image from being stretched or distorted. We recommend keeping this on for most uses."
    },
    {
        question: "Can I make my image larger with the resizer?",
        answer: "You can increase the dimensions, but be aware that this can make the image look blurry or pixelated. For increasing size and improving quality, we recommend using our AI Upscaler tool."
    },
];

const sampleImage = 'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=800&q=80';

export default function ImageResizerPage() {
  const [width, setWidth] = useState<number | string>('');
  const [height, setHeight] = useState<number | string>('');
  const [originalAspectRatio, setOriginalAspectRatio] = useState<number | null>(null);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('original');

  const onFileLoad = (file: File) => {
    const img = new window.Image();
    img.onload = () => {
      setWidth(img.width);
      setHeight(img.height);
      setOriginalAspectRatio(img.width / img.height);
      setImage(img);
      setOriginalFile(file);
      setIsSuccess(false);
      setActiveTab('original');
    };
    img.onerror = () => {
        toast({
            title: "Error loading image",
            description: "The selected file could not be loaded as an image.",
            variant: "destructive"
        })
    };
    img.src = URL.createObjectURL(file);
  };
  
  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = e.target.value;
    setWidth(newWidth);
    if (maintainAspectRatio && originalAspectRatio && newWidth) {
      setHeight(Math.round(Number(newWidth) / originalAspectRatio));
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = e.target.value;
    setHeight(newHeight);
    if (maintainAspectRatio && originalAspectRatio && newHeight) {
      setWidth(Math.round(Number(newHeight) * originalAspectRatio));
    }
  };

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const targetWidth = Number(width);
    const targetHeight = Number(height);

    if (!width || !height || targetWidth <= 0 || targetHeight <= 0) {
      ctx.clearRect(0,0, canvas.width, canvas.height);
      return;
    }

    canvas.width = targetWidth;
    canvas.height = targetHeight;
    
    ctx.drawImage(image, 0, 0, targetWidth, targetHeight);

  }, [image, width, height]);

  useEffect(() => {
    if(image){
        drawCanvas();
    }
  }, [drawCanvas, image]);
  
  const handleResize = () => {
     if (!width || !height || Number(width) <= 0 || Number(height) <= 0) {
        toast({ title: 'Invalid Dimensions', description: 'Please provide a valid width and height.', variant: 'destructive'});
        return;
      }
      setIsProcessing(true);
      setActiveTab('result');
      setTimeout(() => {
        drawCanvas();
        setIsProcessing(false);
        setIsSuccess(true);
         toast({
          title: "Image Resized!",
          description: `Your image has been resized to ${width}x${height}px.`
      });
      }, 500);
  }

  const handleDownload = () => {
      const canvas = canvasRef.current;
      if (!canvas || !image || !originalFile) return;

      if(!isSuccess) {
          handleResize();
      }

      const mimeType = originalFile.type.startsWith('image/') ? originalFile.type : 'image/png';
      const dataUrl = canvas.toDataURL(mimeType);

      const a = document.createElement('a');
      a.href = dataUrl;
<<<<<<< HEAD
      a.download = `freebg_resized_${originalFile.name}`;
=======
      a.download = `pixelpro_resized_${originalFile.name}`;
>>>>>>> 3d22b1f70e46f9b27876a64621858138cbc3d477
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(dataUrl);
  };
  
  const handleReset = () => {
      setImage(null);
      setOriginalFile(null);
      setWidth('');
      setHeight('');
      setOriginalAspectRatio(null);
      setIsProcessing(false);
      setIsSuccess(false);
      setActiveTab('original');
  }

  const handleTrySample = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    handleReset();
    try {
      const response = await fetch(sampleImage);
      const blob = await response.blob();
      const file = new File([blob], "sample-cat.jpg", { type: "image/jpeg" });
      onFileLoad(file);
    } catch (err) {
      toast({ title: "Failed to load sample", description: "Could not fetch the sample image.", variant: "destructive"});
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
          <h1 className="text-3xl font-bold tracking-tight md:text-5xl font-headline">Image Resizer</h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">Change image dimensions in pixels. A fast, easy, and free tool for resizing photos and pictures online.</p>
        </div>
      </div>
      
       {!originalFile ? (
        <Card className="w-full max-w-3xl mx-auto">
          <CardContent className="p-4">
            <FileUploader onFileSelect={onFileLoad}>
              <div className="text-center p-12">
                <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">Upload an image to get started</h3>
                <p className="mt-1 text-sm text-muted-foreground">Drag and drop or click to browse</p>
                <Button onClick={handleTrySample} variant="link" className="mt-2">Or try a sample image</Button>
              </div>
            </FileUploader>
          </CardContent>
        </Card>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          <div className="lg:col-span-8">
             <Card className="sticky top-24">
                <CardContent className="p-4">
                     <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="original">Original</TabsTrigger>
                            <TabsTrigger value="result">Result</TabsTrigger>
                        </TabsList>
                        <TabsContent value="original" className="mt-4">
                             <div className="aspect-square w-full rounded-md overflow-hidden relative bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAACJJREFUOE9jfPbs2X8GPEBTUwOCg4MCAgJGk4iA8J8wYgMARpsA4gEAXEM3eY1hH9sAAAAASUVORK5CYII=')] bg-repeat flex items-center justify-center">
                                <Image src={URL.createObjectURL(originalFile)} alt="Original" fill objectFit="contain" />
                            </div>
                        </TabsContent>
                        <TabsContent value="result" className="mt-4">
                             <div className="aspect-square w-full rounded-md overflow-hidden relative bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAACJJREFUOE9jfPbs2X8GPEBTUwOCg4MCAgJGk4iA8J8wYgMARpsA4gEAXEM3eY1hH9sAAAAASUVORK5CYII=')] bg-repeat flex items-center justify-center">
                                <AnimatePresence>
                                    {isProcessing && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center z-10"
                                    >
                                        <div className="flex flex-col items-center gap-2">
                                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                        <p className="text-muted-foreground">Resizing...</p>
                                        </div>
                                    </motion.div>
                                    )}
                                </AnimatePresence>
                                <AnimatePresence>
                                    {image && (
                                        <motion.canvas
                                            ref={canvasRef}
                                            key="canvas"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="max-w-full max-h-full object-contain"
                                        />
                                    )}
                                </AnimatePresence>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-4">
            <Card className="bg-background/80 backdrop-blur-sm">
                <CardContent className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Controls</h3>
                        <Button variant="ghost" size="icon" onClick={handleReset} aria-label="Start over">
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="width">Width (px)</Label>
                                <Input id="width" type="number" value={width} onChange={handleWidthChange} disabled={isProcessing} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="height">Height (px)</Label>
                                <Input id="height" type="number" value={height} onChange={handleHeightChange} disabled={isProcessing} />
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch id="aspect-ratio" checked={maintainAspectRatio} onCheckedChange={setMaintainAspectRatio} />
                            <Label htmlFor="aspect-ratio">Maintain aspect ratio</Label>
                        </div>
                    </div>
                     <Button onClick={handleResize} disabled={isProcessing} className="w-full h-12">
                        {isProcessing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Resizing...</> : 'Apply Size'}
                     </Button>
                     <Button onClick={handleDownload} disabled={isProcessing} className="w-full h-12">
                        <Download className="mr-2 h-4 w-4" />
                        Download Image
                    </Button>
                </CardContent>
            </Card>
          </div>
        </motion.div>
      )}

      <div className="w-full max-w-6xl mx-auto space-y-12 mt-16">
        <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">Why Use Our Image Resizer?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 border rounded-lg bg-background">
                <Zap className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Pixel Perfect</h3>
                <p className="text-muted-foreground">Get the exact dimensions you need for any project, from web design to social media posts, with precise pixel control.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 border rounded-lg bg-background">
                <ShieldCheck className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Client-Side Security</h3>
                <p className="text-muted-foreground">All resizing happens in your browser. Your images are never uploaded, ensuring 100% privacy.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 border rounded-lg bg-background">
                <Sparkles className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Distortion</h3>
                <p className="text-muted-foreground">Our 'Maintain Aspect Ratio' feature automatically prevents your images from being stretched or squashed.</p>
            </div>
        </div>

        <section className="bg-background p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 font-headline text-center">How to Resize an Image</h2>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="p-3 bg-primary/10 rounded-full mb-3 flex items-center justify-center w-12 h-12"><span className="text-2xl font-bold text-primary">1</span></div>
              <h3 className="font-semibold mb-1">Upload Your Photo</h3>
              <p className="text-sm text-muted-foreground">Select the photo you want to resize. The current dimensions will be automatically detected.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-3 bg-primary/10 rounded-full mb-3 flex items-center justify-center w-12 h-12"><span className="text-2xl font-bold text-primary">2</span></div>
              <h3 className="font-semibold mb-1">Enter New Dimensions</h3>
              <p className="text-sm text-muted-foreground">Type your desired width or height. Keep 'Maintain aspect ratio' checked to avoid distortion.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-3 bg-primary/10 rounded-full mb-3 flex items-center justify-center w-12 h-12"><span className="text-2xl font-bold text-primary">3</span></div>
              <h3 className="font-semibold mb-1">Resize & Download</h3>
              <p className="text-sm text-muted-foreground">Click download and your newly sized photo will be saved for free.</p>
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
