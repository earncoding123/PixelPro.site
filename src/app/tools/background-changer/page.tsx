
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Download, UploadCloud, Palette, Image as ImageIcon, X, Loader2, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { FileUploader } from '@/components/file-uploader';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { FAQ } from '@/components/faq';
import { Label } from '@/components/ui/label';
import { SampleImage, SampleImagePicker } from '@/components/sample-image-picker';

const faqItems = [
    {
        question: "How does the Background Changer work?",
        answer: "Our AI first identifies the main subject in your foreground image and removes its original background. Then, it seamlessly merges that subject onto the new background you provide, whether it's a solid color or another image."
    },
    {
        question: "What kind of images work best for the foreground?",
        answer: "For the best results, use an image where the main subject is clearly defined with good contrast against its original background. High-resolution images will produce a cleaner final result."
    },
    {
        question: "Can I use any image as a new background?",
        answer: "Yes, you can upload any image you want as the new background. The tool will place your foreground subject into the new scene. For best results, consider the lighting and perspective of both images."
    },
];

const sampleImages: SampleImage[] = [
    { url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80', description: 'Person' },
    { url: 'https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=800&q=80', description: 'Dog' },
    { url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80', description: 'Car' },
];


export default function BackgroundChangerPage() {
  const [foregroundFile, setForegroundFile] = useState<File | null>(null);
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [backgroundType, setBackgroundType] = useState<'image' | 'color'>('color');
  
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('foreground');

  const { toast } = useToast();

  const resetState = () => {
    setForegroundFile(null);
    setBackgroundFile(null);
    setBackgroundColor('#ffffff');
    if (processedImageUrl) URL.revokeObjectURL(processedImageUrl);
    setProcessedImageUrl(null);
    setIsProcessing(false);
    setError(null);
    setIsSuccess(false);
    setActiveTab('foreground');
  };
  
  const handleProcessImage = async () => {
    if (!foregroundFile) {
      toast({ title: "Foreground missing", description: "Please upload a foreground image.", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    setError(null);
    setIsSuccess(false);
    if(processedImageUrl) URL.revokeObjectURL(processedImageUrl);
    setProcessedImageUrl(null);
    setActiveTab('result');

    const API_URL = "https://earncoding-background-changer-api.hf.space/api/process-image";
    const API_TOKEN = "123Lock.on";

    const formData = new FormData();
    formData.append("foreground", foregroundFile);

    if (backgroundType === 'image' && backgroundFile) {
        formData.append("background", backgroundFile);
    } else if (backgroundType === 'color') {
        formData.append("use_color", backgroundColor);
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // for UX
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            "x-auth-token": API_TOKEN
        },
        body: formData
      });

      if (response.status === 401) {
        throw new Error("Unauthorized! Check your API Secret.");
      }

      if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "Server Error");
      }

      const imageBlob = await response.blob();
      const imageUrl = URL.createObjectURL(imageBlob);
      setProcessedImageUrl(imageUrl);
      setIsSuccess(true);
      toast({
        title: "Success!",
        description: "Your background has been changed.",
      });

    } catch (err: any) {
      const errorMessage = err.message || "An unexpected error occurred during background change.";
      setError(errorMessage);
      toast({ title: "Processing Error", description: errorMessage, variant: "destructive" });
      setActiveTab('foreground');
    } finally {
      setTimeout(() => setIsProcessing(false), 500);
    }
  };

  const handleDownload = () => {
    if (!processedImageUrl) return;
    const a = document.createElement('a');
    a.href = processedImageUrl;
    a.download = `pixelpro_bg_changed_${foregroundFile?.name || 'image'}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  
  const handleTrySample = async (sample: SampleImage) => {
    resetState();
    try {
      const response = await fetch(sample.url);
      const blob = await response.blob();
      const file = new File([blob], `sample-${sample.description.toLowerCase()}.jpg`, { type: "image/jpeg" });
      setForegroundFile(file);
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
            <h1 className="text-3xl font-bold tracking-tight md:text-5xl font-headline">AI Background Changer</h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">Swap out boring backgrounds. Transport your subject anywhere instantly with a new image or a clean solid color.</p>
          </div>
        </div>

      {!foregroundFile ? (
        <Card className="w-full max-w-3xl mx-auto">
          <CardContent className="p-4">
            <FileUploader onFileSelect={setForegroundFile}>
              <div className="text-center p-8 md:p-12">
                <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">Upload a foreground image</h3>
                <p className="mt-1 text-sm text-muted-foreground">This is the image you want to keep the subject of.</p>
              </div>
            </FileUploader>
             <SampleImagePicker samples={sampleImages} onSelect={handleTrySample} />
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
                        <TabsTrigger value="foreground">Foreground</TabsTrigger>
                        <TabsTrigger value="result">Result</TabsTrigger>
                    </TabsList>
                    <TabsContent value="foreground" className="mt-4">
                         <div className="aspect-square w-full rounded-md overflow-hidden relative bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAACJJREFUOE9jfPbs2X8GPEBTUwOCg4MCAgJGk4iA8J8wYgMARpsA4gEAXEM3eY1hH9sAAAAASUVORK5CYII=')] bg-repeat flex items-center justify-center">
                            <Image src={URL.createObjectURL(foregroundFile)} alt="Foreground" fill objectFit="contain" />
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
                                   <p className="text-muted-foreground">Processing Image...</p>
                                 </div>
                               </motion.div>
                             )}
                           </AnimatePresence>
                          <AnimatePresence>
                            {processedImageUrl && (
                              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full w-full">
                                <Image src={processedImageUrl} alt="Processed" fill objectFit="contain" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                           {!processedImageUrl && !isProcessing && <div className="text-muted-foreground text-center p-4">The result will appear here.</div>}
                        </div>
                    </TabsContent>
                </Tabs>
                 {error && <Alert variant="destructive" className="mt-4"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-4">
            <Card className="bg-background/80 backdrop-blur-sm">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Controls</h3>
                  <Button variant="ghost" size="icon" onClick={resetState} aria-label="Start over"><X className="h-4 w-4" /></Button>
                </div>
                
                <Tabs value={backgroundType} onValueChange={(value) => setBackgroundType(value as any)} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="color"><Palette className="mr-2 h-4 w-4"/>Color</TabsTrigger>
                    <TabsTrigger value="image"><ImageIcon className="mr-2 h-4 w-4"/>Image</TabsTrigger>
                  </TabsList>
                  <TabsContent value="color" className="pt-4">
                     <div className="flex items-center gap-2">
                      <Label htmlFor="color-picker" className="sr-only">Background Color</Label>
                      <Input id="color-picker" type="color" value={backgroundColor} onChange={e => setBackgroundColor(e.target.value)} className="p-1 h-10" />
                      <Input type="text" value={backgroundColor} onChange={e => setBackgroundColor(e.target.value)} />
                    </div>
                  </TabsContent>
                  <TabsContent value="image" className="pt-4">
                    {!backgroundFile ? (
                      <FileUploader onFileSelect={setBackgroundFile} className="h-24">
                        <div className="text-center text-sm p-2 flex flex-col items-center justify-center h-full">
                          <UploadCloud className="h-6 w-6 text-muted-foreground mb-1" />
                          <span>Upload Background</span>
                        </div>
                      </FileUploader>
                    ) : (
                      <div className="relative">
                        <Image src={URL.createObjectURL(backgroundFile)} alt="Background Preview" width={100} height={100} className="w-full h-auto rounded-md" />
                        <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => setBackgroundFile(null)}><X className="h-4 w-4"/></Button>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>

                <Button onClick={handleProcessImage} disabled={isProcessing || (backgroundType === 'image' && !backgroundFile)} className="w-full h-12">
                  {isProcessing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Processing...</> : 'Change Background'}
                </Button>
                
                <Button onClick={handleDownload} disabled={!processedImageUrl || isProcessing} className="w-full h-12" variant={isSuccess ? 'default' : 'secondary'}>
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
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">Why Use Our Background Changer?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 border rounded-lg">
                <Zap className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Instant Results</h3>
                <p className="text-muted-foreground">Our powerful AI processes your image in seconds, not minutes. Get professional results without the wait.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 border rounded-lg">
                <ShieldCheck className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Maximum Privacy</h3>
                <p className="text-muted-foreground">Your images are processed directly via API and are never stored on our servers, ensuring your data remains private.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 border rounded-lg">
                <Sparkles className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Unleash Creativity</h3>
                <p className="text-muted-foreground">Create stunning product photos, social media posts, or profile pictures by placing your subject in any setting imaginable.</p>
            </div>
        </div>

        <section className="bg-secondary p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 font-headline text-center">How to Change Your Image Background</h2>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="p-3 bg-primary/10 rounded-full mb-3 flex items-center justify-center w-12 h-12"><span className="text-2xl font-bold text-primary">1</span></div>
              <h3 className="font-semibold mb-1">Upload Foreground</h3>
              <p className="text-sm text-muted-foreground">Start by uploading the main image you want to keep the subject of.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-3 bg-primary/10 rounded-full mb-3 flex items-center justify-center w-12 h-12"><span className="text-2xl font-bold text-primary">2</span></div>
              <h3 className="font-semibold mb-1">Choose New Background</h3>
              <p className="text-sm text-muted-foreground">Select either a solid color or upload a new background image.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-3 bg-primary/10 rounded-full mb-3 flex items-center justify-center w-12 h-12"><span className="text-2xl font-bold text-primary">3</span></div>
              <h3 className="font-semibold mb-1">Process and Download</h3>
              <p className="text-sm text-muted-foreground">Click 'Change Background' and our AI will do the rest. Download your new image for free!</p>
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

    