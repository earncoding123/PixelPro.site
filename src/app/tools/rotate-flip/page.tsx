
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { FileUploader } from '@/components/file-uploader';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RotateCcw, RotateCw, FlipHorizontal, FlipVertical, UploadCloud, Download, X, Sparkles, ShieldCheck, Zap, Loader2 } from 'lucide-react';
import { FAQ } from '@/components/ui/faq';
import { Card, CardContent } from '@/components/ui/card';
import { AnimatePresence, motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SampleImage, SampleImagePicker } from '@/components/sample-image-picker';
import { Slider } from '@/components/ui/slider';

const faqItems = [
    {
        question: "Will rotating or flipping my image reduce its quality?",
        answer: "No, these operations are 'lossless,' meaning they do not reduce the image quality. The pixels are simply rearranged, not re-compressed."
    },
    {
        question: "What's the difference between rotating and flipping?",
        answer: "Rotating turns the image around a central point (e.g., 90 degrees clockwise). Flipping creates a mirror image across a central line, either horizontally (left to right) or vertically (top to bottom)."
    },
    {
        question: "Can I apply multiple rotations and flips?",
        answer: "Yes! You can use the slider for precise rotation and click the buttons as many times as you need. For example, you can rotate an image 45 degrees, then flip it horizontally. The preview will update with each change."
    },
];

const sampleImages: SampleImage[] = [
    { url: 'https://images.unsplash.com/photo-1666890275695-ec3a93d41597?w=800&q=80', description: 'Building' },
    { url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&q=80', description: 'Person' },
    { url: 'https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=800&q=80', description: 'Dog' },
];


export default function RotateFlipPage() {
  const [rotation, setRotation] = useState(0);
  const [flip, setFlip] = useState({ horizontal: false, vertical: false });
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('original');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);


  const drawCanvas = useCallback(() => {
    if (!image || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rad = rotation * Math.PI / 180;
    const w = image.naturalWidth;
    const h = image.naturalHeight;
    
    // Calculate the new canvas dimensions to fit the rotated image
    const newWidth = Math.abs(w * Math.cos(rad)) + Math.abs(h * Math.sin(rad));
    const newHeight = Math.abs(w * Math.sin(rad)) + Math.abs(h * Math.cos(rad));
    
    canvas.width = newWidth;
    canvas.height = newHeight;
    
    // Save the current context state
    ctx.save();
    // Move the origin to the center of the canvas
    ctx.translate(newWidth / 2, newHeight / 2);
    // Apply rotation
    ctx.rotate(rad);
    // Apply flip
    ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
    // Draw the image centered
    ctx.drawImage(image, -w / 2, -h / 2);
    // Restore the context to its original state
    ctx.restore();

  }, [image, rotation, flip]);

  useEffect(() => {
    if(originalFile && activeTab === 'result'){
      drawCanvas();
    }
  }, [drawCanvas, originalFile, activeTab]);


  const onFileLoad = (file: File) => {
    const img = new window.Image();
    img.onload = () => {
      setImage(img);
      setOriginalFile(file);
      setRotation(0);
      setFlip({ horizontal: false, vertical: false });
      setActiveTab('original');
      setIsSuccess(false);
    };
    img.src = URL.createObjectURL(file);
  };
  
  const handleApply = () => {
    if (!image) return;
    setIsProcessing(true);
    setActiveTab('result');
    setTimeout(() => {
        drawCanvas();
        setIsProcessing(false);
        setIsSuccess(true);
        toast({
            title: "Changes Applied!",
            description: "Your image is ready to be downloaded.",
        });
    }, 300);
  };

  const handleRotate = (degrees: number) => {
    setRotation(prev => (prev + degrees));
    setIsSuccess(false);
  };

  const handleFlip = (direction: 'horizontal' | 'vertical') => {
    setFlip(prev => ({ ...prev, [direction]: !prev[direction] }));
    setIsSuccess(false);
  };

  const handleResetControls = () => {
    setRotation(0);
    setFlip({ horizontal: false, vertical: false });
    setIsSuccess(false);
  };
  
  const handleResetAll = () => {
      setImage(null);
      setOriginalFile(null);
      handleResetControls();
      setActiveTab('original');
      setIsSuccess(false);
  }

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas || !image) {
        toast({ title: "Error", description: "No image to download.", variant: "destructive" });
        return;
    }
    if (!isSuccess) {
        toast({ title: "Apply Changes First", description: "Please click 'Apply Changes' before downloading.", variant: "default"});
        return;
    }

    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `pixelpro_rotated_${originalFile?.name || 'image.png'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(dataUrl);
  };

  const handleTrySample = async (sample: SampleImage) => {
    handleResetAll();
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
      <div className="relative isolate overflow-hidden bg-background px-6 py-12 text-center sm:px-16 sm:py-24" style={{backgroundImage: 'radial-gradient(at 0% 0%, hsla(253, 100%, 70%, 0.1), transparent 50%), radial-gradient(at 80% 100%, hsla(339, 100%, 70%, 0.1), transparent 50%)'}}>
          <div className="mx-auto max-w-2xl">
              <h1 className="text-3xl font-bold tracking-tight md:text-5xl font-headline">Rotate & Flip Image</h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">Correct your photo's orientation in an instant. Rotate precisely by degree or create a mirror image with a single click.</p>
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
            <Card className="sticky top-24">
              <CardContent className="p-4">
                 <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="original">Original</TabsTrigger>
                        <TabsTrigger value="result">Result</TabsTrigger>
                    </TabsList>
                    <TabsContent value="original" className="mt-4">
                         <div className="aspect-square w-full rounded-md overflow-hidden relative bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAACJJREFUOE9jfPbs2X8GPEBTUwOCg4MCAgJGk4iA8J8wYgMARpsA4gEAXEM3eY1hH9sAAAAASUVORK5CYII=')] bg-repeat flex items-center justify-center">
                           {originalFile && <img src={URL.createObjectURL(originalFile)} alt="Original" style={{maxHeight: '100%', maxWidth: '100%', objectFit: 'contain'}} />}
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
                                            <p className="text-muted-foreground">Applying Changes...</p>
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
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Controls</h3>
                    <Button variant="ghost" size="icon" onClick={handleResetAll} aria-label="Start over"><X className="h-4 w-4" /></Button>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Label>Rotate</Label>
                        <span className="text-sm font-medium text-muted-foreground">{rotation.toFixed(0)}°</span>
                    </div>
                    <Slider
                      value={[rotation]}
                      onValueChange={(v) => {
                          setRotation(v[0]);
                          setIsSuccess(false);
                      }}
                      min={-180} max={180} step={1}
                    />
                    <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" onClick={() => handleRotate(-90)}><RotateCcw className="mr-2 h-4 w-4" /> -90°</Button>
                        <Button variant="outline" onClick={() => handleRotate(90)}><RotateCw className="mr-2 h-4 w-4" /> +90°</Button>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Flip</Label>
                     <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" onClick={() => handleFlip('horizontal')}><FlipHorizontal className="mr-2 h-4 w-4" /> Horizontal</Button>
                        <Button variant="outline" onClick={() => handleFlip('vertical')}><FlipVertical className="mr-2 h-4 w-4" /> Vertical</Button>
                    </div>
                </div>
                <div className="space-y-2">
                     <Button variant="secondary" onClick={handleResetControls} className="w-full">Reset Controls</Button>
                </div>
                
                <Button onClick={handleApply} disabled={isProcessing || !image} className="w-full h-12">
                   {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4" />}
                   {isProcessing ? 'Applying...' : 'Apply Changes'}
                </Button>

                <Button onClick={handleDownload} disabled={!isSuccess || !image} className="w-full h-12">
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
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">Why Use Our Rotate & Flip Tool?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 border rounded-lg">
                <Zap className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Precise Control</h3>
                <p className="text-muted-foreground">Go beyond 90-degree turns. Our slider lets you rotate your image to the exact angle you need for perfect alignment.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 border rounded-lg">
                <ShieldCheck className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Completely Private</h3>
                <p className="text-muted-foreground">All processing happens in your browser. Your images are never uploaded to a server, ensuring total security.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 border rounded-lg">
                <Sparkles className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Lossless Quality</h3>
                <p className="text-muted-foreground">Rotating and flipping are lossless operations, meaning your image quality remains exactly the same, no matter how much you adjust.</p>
            </div>
        </div>
        <section className="bg-secondary p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 font-headline text-center">How to Rotate and Flip an Image</h2>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="p-3 bg-primary/10 rounded-full mb-3 flex items-center justify-center w-12 h-12"><span className="text-2xl font-bold text-primary">1</span></div>
              <h3 className="font-semibold mb-1">Upload Your Image</h3>
              <p className="text-sm text-muted-foreground">Select the image you wish to orient from your device.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-3 bg-primary/10 rounded-full mb-3 flex items-center justify-center w-12 h-12"><span className="text-2xl font-bold text-primary">2</span></div>
              <h3 className="font-semibold mb-1">Rotate or Flip</h3>
              <p className="text-sm text-muted-foreground">Use the slider for fine-tuning or buttons to rotate 90° or create a mirror image.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-3 bg-primary/10 rounded-full mb-3 flex items-center justify-center w-12 h-12"><span className="text-2xl font-bold text-primary">3</span></div>
              <h3 className="font-semibold mb-1">Download Your Image</h3>
              <p className="text-sm text-muted-foreground">Your reoriented photo is ready to download instantly.</p>
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
