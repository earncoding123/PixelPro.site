
'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FAQ } from '@/components/faq';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { FileUploader } from '@/components/file-uploader';
import { Card, CardContent } from '@/components/ui/card';
import { UploadCloud, Download, X, Loader2, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


const PRESETS = [
  { name: 'Instagram Square', width: 1080, height: 1080 },
  { name: 'Instagram Portrait', width: 1080, height: 1350 },
  { name: 'Instagram Landscape', width: 1080, height: 566 },
  { name: 'Facebook Cover', width: 820, height: 360 },
  { name: 'YouTube Thumbnail', width: 1280, height: 720 },
  { name: 'TikTok', width: 1080, height: 1920 },
];

const faqItems = [
    {
        question: "What does 'Crop to Fit' do?",
        answer: "When 'Crop to Fit' is enabled, the image will be scaled to fill the entire preset area, and any parts that fall outside the dimensions will be cropped from the center. If disabled, the entire image will be shrunk to fit inside the preset dimensions, possibly leaving empty space (padding)."
    },
    {
        question: "Why do the preset sizes look different from my phone?",
        answer: "The presets use the official recommended dimensions for each platform (e.g., 1080x1080 for an Instagram post). While they might be displayed differently on various devices, uploading an image with these dimensions ensures the best quality and compatibility."
    },
    {
        question: "Can I use this for platforms not listed?",
        answer: "While we offer presets for the most popular platforms, you can use our standard 'Image Resizer' tool to enter any custom width and height you need for other websites or uses."
    },
];

const sampleImage = 'https://images.unsplash.com/photo-1611162616805-6a4066914561?w=800&q=80';


export default function ResizeSocialPage() {
  const [preset, setPreset] = useState<string>(JSON.stringify(PRESETS[0]));
  const [cropToFit, setCropToFit] = useState(true);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('original');


  const onFileLoad = (file: File) => {
    const img = new window.Image();
    img.onload = () => {
        setImage(img);
        setOriginalFile(file);
        setIsSuccess(false);
        setActiveTab('original');
    };
    img.src = URL.createObjectURL(file);
  };
  
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const selectedPreset = JSON.parse(preset);
    canvas.width = selectedPreset.width;
    canvas.height = selectedPreset.height;
    
    ctx.fillStyle = 'white';
    ctx.fillRect(0,0,canvas.width, canvas.height);

    const imgRatio = image.width / image.height;
    const presetRatio = canvas.width / canvas.height;
    
    let sx = 0, sy = 0, sWidth = image.width, sHeight = image.height;
    let dx = 0, dy = 0, dWidth = canvas.width, dHeight = canvas.height;

    if (cropToFit) {
      if (imgRatio > presetRatio) { // image wider than preset
        sHeight = image.height;
        sWidth = sHeight * presetRatio;
        sx = (image.width - sWidth) / 2;
      } else { // image taller than preset
        sWidth = image.width;
        sHeight = sWidth / presetRatio;
        sy = (image.height - sHeight) / 2;
      }
    } else { // Fit inside (letterbox)
      if (imgRatio > presetRatio) { // image wider
        dHeight = canvas.width / imgRatio;
        dy = (canvas.height - dHeight) / 2;
      } else { // image taller
        dWidth = canvas.height * imgRatio;
        dx = (canvas.width - dWidth) / 2;
      }
    }
    
    ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
  }, [image, preset, cropToFit]);

  useEffect(() => {
      if(image){
        drawCanvas();
      }
  }, [drawCanvas, image])

  const handleResizeImage = () => {
    setIsProcessing(true);
    setActiveTab('result');
    setTimeout(() => {
        drawCanvas();
        setIsProcessing(false);
        setIsSuccess(true);
        toast({
            title: "Image Resized!",
            description: "Your image is ready for social media."
        })
    }, 500);
  }

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas || !image || !originalFile) return;
    if(!isSuccess) {
      handleResizeImage();
    }
    drawCanvas();
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
<<<<<<< HEAD
    a.download = `freebg_social_${originalFile.name}`;
=======
    a.download = `pixelpro_social_${originalFile.name}`;
>>>>>>> 3d22b1f70e46f9b27876a64621858138cbc3d477
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(dataUrl);
  };

  const handleReset = () => {
      setImage(null);
      setOriginalFile(null);
      setIsSuccess(false);
      setIsProcessing(false);
      setActiveTab('original');
  };

  const handleTrySample = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    handleReset();
    try {
      const response = await fetch(sampleImage);
      const blob = await response.blob();
      const file = new File([blob], "sample-social.jpg", { type: "image/jpeg" });
      onFileLoad(file);
    } catch (err) {
      toast({ title: "Failed to load sample", description: "Could not fetch the sample image.", variant: "destructive"});
    }
  };


  return (
    <div className="space-y-16">
      <div className="relative isolate overflow-hidden bg-background px-6 py-12 text-center sm:px-16 sm:py-24" style={{backgroundImage: 'radial-gradient(at 0% 100%, hsla(212, 100%, 70%, 0.1), transparent 50%), radial-gradient(at 80% 0%, hsla(28, 100%, 70%, 0.1), transparent 50%)'}}>
        <div className="mx-auto max-w-2xl">
            <h1 className="text-3xl font-bold tracking-tight md:text-5xl font-headline">Resize for Social Media</h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">Never guess image dimensions again. Get the perfect size for Instagram, Facebook, YouTube, and more with one-click presets.</p>
        </div>
      </div>
      {!originalFile ? (
        <Card className="w-full max-w-3xl mx-auto">
            <CardContent className="p-4">
                <FileUploader onFileSelect={onFileLoad}>
                    <div className="text-center p-8 md:p-12">
                        <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-semibold">Upload an image to start</h3>
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
                             <div className="aspect-square w-full rounded-md overflow-hidden relative bg-muted flex items-center justify-center">
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
                                      <p className="text-muted-foreground">Resizing Image...</p>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                              <AnimatePresence>
                                {image && (
                                  <motion.canvas
                                      ref={canvasRef}
                                      key="canvas-social"
                                      initial={{ opacity: 0, scale: 0.95 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      className="max-w-full max-h-full h-auto object-contain" 
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
                        <Button variant="ghost" size="icon" onClick={handleReset} aria-label="Start over"><X className="h-4 w-4" /></Button>
                    </div>
                    <div className="space-y-2">
                        <Label>Social Media Preset</Label>
                        <Select value={preset} onValueChange={setPreset} disabled={isProcessing}>
                            <SelectTrigger><SelectValue placeholder="Choose a preset" /></SelectTrigger>
                            <SelectContent>
                                {PRESETS.map((p, i) => (
                                    <SelectItem key={i} value={JSON.stringify(p)}>{p.name} ({p.width}x{p.height})</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center space-x-2 pt-2">
                      <Switch id="crop-to-fit" checked={cropToFit} onCheckedChange={setCropToFit} disabled={isProcessing} />
                      <Label htmlFor="crop-to-fit">Crop to Fit</Label>
                    </div>
                    
                    <Button onClick={handleResizeImage} disabled={isProcessing} className="w-full h-12">
                       {isProcessing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Resizing...</> : 'Resize Image'}
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
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">Why Use Our Social Media Resizer?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 border rounded-lg">
                <Zap className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">One-Click Presets</h3>
                <p className="text-muted-foreground">Stop searching for image dimensions. Our up-to-date presets give you the perfect size instantly.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 border rounded-lg">
                <ShieldCheck className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Private & Secure</h3>
                <p className="text-muted-foreground">All resizing is done in your browser. Your images never touch our servers, ensuring your privacy.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 border rounded-lg">
                <Sparkles className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Perfect Framing</h3>
                <p className="text-muted-foreground">Use the "Crop to Fit" toggle to choose between filling the frame or showing the entire image.</p>
            </div>
        </div>
        <section className="bg-secondary p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 font-headline text-center">How to Resize for Social Media</h2>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="p-3 bg-primary/10 rounded-full mb-3 flex items-center justify-center w-12 h-12"><span className="text-2xl font-bold text-primary">1</span></div>
              <h3 className="font-semibold mb-1">Upload Your Image</h3>
              <p className="text-sm text-muted-foreground">Choose the photo you want to post on social media.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-3 bg-primary/10 rounded-full mb-3 flex items-center justify-center w-12 h-12"><span className="text-2xl font-bold text-primary">2</span></div>
              <h3 className="font-semibold mb-1">Choose a Preset</h3>
              <p className="text-sm text-muted-foreground">Select the social media platform you're resizing for, like 'Instagram Square' or 'YouTube Thumbnail'.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-3 bg-primary/10 rounded-full mb-3 flex items-center justify-center w-12 h-12"><span className="text-2xl font-bold text-primary">3</span></div>
              <h3 className="font-semibold mb-1">Download your Image</h3>
              <p className="text-sm text-muted-foreground">Click 'Resize' then 'Download' to get your perfectly formatted photo.</p>
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
