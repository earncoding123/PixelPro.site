
'use client';

import { useState, useRef } from 'react';
import ReactCrop, { type Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileUploader } from '@/components/file-uploader';
import { Download, UploadCloud, X, Loader2, Crop as CropIcon, ZoomIn, ZoomOut, RotateCcw, Sparkles, ShieldCheck, Zap, Lock, LockOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { FAQ } from '@/components/faq';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SampleImage, SampleImagePicker } from '@/components/sample-image-picker';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';


const PRESETS = [
  { name: 'Freeform', aspect: undefined },
  { name: 'Square (1:1)', aspect: 1 / 1 },
  { name: 'Portrait (4:5)', aspect: 4 / 5 },
  { name: 'Landscape (16:9)', aspect: 16 / 9 },
  { name: 'FB Post (1.91:1)', aspect: 1.91 / 1 },
];

const faqItems = [
    {
        question: "What is image cropping?",
        answer: "Image cropping is the process of removing unwanted outer areas of an image. You can use it to change the aspect ratio, improve framing, or focus on a specific subject within the picture."
    },
    {
        question: "How do the presets work?",
        answer: "The presets automatically set the cropper to a specific aspect ratio. For example, 'Square (1:1)' will lock the crop box to a perfect square, which is ideal for profile pictures. 'Freeform' lets you drag and select any rectangular shape you want."
    },
    {
        question: "Will cropping reduce the quality of my image?",
        answer: "Cropping itself does not reduce the quality of the selected area. However, if you crop a small portion of a large image and then enlarge it, it may appear blurry. The original image data within the crop area is preserved."
    },
];

const sampleImages: SampleImage[] = [
    { url: 'https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=800&q=80', description: 'Dog' },
    { url: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800&q=80', description: 'Cat' },
    { url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&q=80', description: 'Person' },
];

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number): Crop {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

async function getCroppedImg(
  image: HTMLImageElement,
  crop: PixelCrop,
  scale: number = 1,
  rotate: number = 0,
): Promise<string> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        throw new Error('No 2d context');
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const rotated = rotate !== 0;
    const Z = Math.sqrt(image.naturalWidth**2 + image.naturalHeight**2);

    const buffer = document.createElement('canvas');
    const b_ctx = buffer.getContext('2d');

    if (!b_ctx) {
        throw new Error('No 2d context');
    }

    buffer.width = Z;
    buffer.height = Z;
    
    b_ctx.translate(Z/2, Z/2);
    b_ctx.rotate(rotate * Math.PI / 180);
    b_ctx.drawImage(image, -image.naturalWidth/2, -image.naturalHeight/2);
   
    const rot_w = Math.abs(image.naturalWidth * Math.cos(rotate * Math.PI / 180)) + Math.abs(image.naturalHeight * Math.sin(rotate * Math.PI / 180));
    const rot_h = Math.abs(image.naturalWidth * Math.sin(rotate * Math.PI / 180)) + Math.abs(image.naturalHeight * Math.cos(rotate * Math.PI / 180));
    
    canvas.width = Math.floor(crop.width * (rot_w / image.width) * scale);
    canvas.height = Math.floor(crop.height * (rot_h / image.height) * scale);
    
    const cropX = crop.x * (rot_w / image.width);
    const cropY = crop.y * (rot_h / image.height);

    ctx.drawImage(
        buffer,
        (Z-rot_w)/2 + cropX,
        (Z-rot_h)/2 + cropY,
        crop.width * (rot_w/image.width),
        crop.height * (rot_h/image.height),
        0,
        0,
        crop.width * (rot_w/image.width),
        crop.height * (rot_h/image.height)
    );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Canvas is empty'));
        return;
      }
      resolve(URL.createObjectURL(blob));
    }, 'image/png');
  });
}


export default function ImageCropperPage() {
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [croppedImageUrl, setCroppedImageUrl] = useState('');
  const [aspect, setAspect] = useState<number | undefined>();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [isAspectLocked, setIsAspectLocked] = useState(true);

  const imgRef = useRef<HTMLImageElement>(null);
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState('original');


  const onFileChange = (file: File) => {
    if (file) {
      handleReset();
      setOriginalFile(file);
      const reader = new FileReader();
      reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''));
      reader.readAsDataURL(file);
    }
  };

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  async function handleCropImage() {
    const image = imgRef.current;
    if (image && completedCrop && completedCrop.width > 0 && completedCrop.height > 0) {
      setIsProcessing(true);
      setActiveTab('result');
      try {
        if(croppedImageUrl) URL.revokeObjectURL(croppedImageUrl);
        const croppedUrl = await getCroppedImg(image, completedCrop, scale, rotate);
        setCroppedImageUrl(croppedUrl);
        toast({ title: 'Image Cropped!', description: 'Your cropped image is ready.' });
      } catch (e) {
        console.error(e);
        toast({ title: 'Error', description: 'Failed to crop image.', variant: 'destructive' });
      } finally {
        setTimeout(() => setIsProcessing(false), 500);
      }
    } else {
        toast({ title: 'Crop Area Invalid', description: 'Please select an area to crop.', variant: 'destructive' });
    }
  }

  const handleDownload = () => {
    if (!croppedImageUrl) {
        handleCropImage().then(() => {
             if (croppedImageUrl) {
                 const a = document.createElement('a');
                 a.href = croppedImageUrl;
<<<<<<< HEAD
                 a.download = `freebg_cropped_${originalFile?.name || 'image.png'}`;
=======
                 a.download = `pixelpro_cropped_${originalFile?.name || 'image.png'}`;
>>>>>>> 3d22b1f70e46f9b27876a64621858138cbc3d477
                 document.body.appendChild(a);
                 a.click();
                 document.body.removeChild(a);
             }
        });
        return;
    }
    const a = document.createElement('a');
    a.href = croppedImageUrl;
<<<<<<< HEAD
    a.download = `freebg_cropped_${originalFile?.name || 'image.png'}`;
=======
    a.download = `pixelpro_cropped_${originalFile?.name || 'image.png'}`;
>>>>>>> 3d22b1f70e46f9b27876a64621858138cbc3d477
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  
  const handleReset = () => {
    setImgSrc('');
    setCrop(undefined);
    setCompletedCrop(undefined);
    setCroppedImageUrl('');
    setAspect(undefined);
    setScale(1);
    setRotate(0);
    setIsProcessing(false);
    setOriginalFile(null);
    if(croppedImageUrl) URL.revokeObjectURL(croppedImageUrl);
    setActiveTab('original');
  }

  const handlePreset = (newAspect: number | undefined) => {
    setAspect(newAspect);
    if (imgRef.current) {
      const { width, height } = imgRef.current;
      const newCrop = centerAspectCrop(width, height, newAspect || width/height);
      setCrop(newCrop);
      setCompletedCrop(newCrop);
    }
  }

   const handleTrySample = async (sample: SampleImage) => {
    handleReset();
    try {
      const response = await fetch(sample.url);
      const blob = await response.blob();
      const file = new File([blob], `sample-${sample.description.toLowerCase()}.jpg`, { type: "image/jpeg" });
      onFileChange(file);
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
          <h1 className="text-3xl font-bold tracking-tight md:text-5xl font-headline">Image Cropper</h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">Trim your photos with precision. Use freeform crop or presets for social media, thumbnails, and more to get the perfect frame.</p>
        </div>
      </div>

      {!imgSrc ? (
        <Card className="w-full max-w-3xl mx-auto">
          <CardContent className="p-4">
            <FileUploader onFileSelect={onFileChange}>
              <div className="text-center p-8 md:p-12">
                <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">Upload an image to crop</h3>
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
                         <div className="w-full rounded-md overflow-hidden relative flex justify-center items-center bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAACJJREFUOE9jfPbs2X8GPEBTUwOCg4MCAgJGk4iA8J8wYgMARpsA4gEAXEM3eY1hH9sAAAAASUVORK5CYII=')] bg-repeat aspect-square">
                            <ReactCrop
                              crop={crop}
                              onChange={c => setCrop(c)}
                              onComplete={c => setCompletedCrop(c)}
                              aspect={isAspectLocked ? aspect : undefined}
                              className="max-h-[70vh]"
                            >
                              <img
                                ref={imgRef}
                                alt="Crop me"
                                src={imgSrc}
                                style={{ transform: `scale(${scale}) rotate(${rotate}deg)`, objectFit: 'contain' }}
                                onLoad={onImageLoad}
                              />
                            </ReactCrop>
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
                                        <p className="text-muted-foreground">Cropping Image...</p>
                                    </div>
                                </motion.div>
                            )}
                          </AnimatePresence>
                          <AnimatePresence>
                            {croppedImageUrl && (
                              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative h-full w-full">
                                <img src={croppedImageUrl} alt="Cropped preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }}/>
                              </motion.div>
                            )}
                          </AnimatePresence>
                          {!croppedImageUrl && !isProcessing && <div className="text-muted-foreground text-center p-4">The result will appear here.</div>}
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
                    <h4 className="font-medium text-sm">Aspect Ratio</h4>
                    <div className="grid grid-cols-2 gap-2">
                        {PRESETS.map(p => (
                            <Button key={p.name} variant={aspect === p.aspect ? 'default': 'secondary'} onClick={() => handlePreset(p.aspect)}>
                                {p.name}
                            </Button>
                        ))}
                    </div>
                     <div className="flex items-center space-x-2 pt-2">
                      <Switch id="aspect-lock" checked={isAspectLocked} onCheckedChange={setIsAspectLocked} />
                      <Label htmlFor="aspect-lock" className="flex items-center gap-1">{isAspectLocked ? <Lock className="h-3 w-3"/> : <LockOpen className="h-3 w-3"/>} Lock Aspect Ratio</Label>
                    </div>
                </div>

                <div className="space-y-2">
                  <Label>Zoom</Label>
                   <Slider
                      value={[scale]}
                      onValueChange={(val) => setScale(val[0])}
                      min={0.1} max={3} step={0.05}
                    />
                </div>
                <div className="space-y-2">
                  <Label>Rotate</Label>
                   <Slider
                      value={[rotate]}
                      onValueChange={(val) => setRotate(val[0])}
                      min={-180} max={180} step={1}
                    />
                </div>
                
                <Button onClick={handleCropImage} disabled={isProcessing} className="w-full h-12">
                    {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <CropIcon className="mr-2 h-4 w-4" />}
                    Crop Image
                </Button>

                <Button onClick={handleDownload} disabled={isProcessing || !completedCrop} className="w-full h-12" variant="secondary">
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
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">Why Use Our Image Cropper?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 border rounded-lg">
                <Zap className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Fast & Easy</h3>
                <p className="text-muted-foreground">No complex software. Just upload, select your area, and crop. It's that simple.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 border rounded-lg">
                <ShieldCheck className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Completely Private</h3>
                <p className="text-muted-foreground">All processing is done in your browser. Your images never leave your computer.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 border rounded-lg">
                <Sparkles className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Presets for Perfection</h3>
                <p className="text-muted-foreground">Use our built-in presets for social media to get the perfect aspect ratio every time, from squares to stories.</p>
            </div>
        </div>

        <section className="bg-secondary p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 font-headline text-center">How to Crop an Image</h2>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="p-3 bg-primary/10 rounded-full mb-3 flex items-center justify-center w-12 h-12"><span className="text-2xl font-bold text-primary">1</span></div>
              <h3 className="font-semibold mb-1">Upload Your Image</h3>
              <p className="text-sm text-muted-foreground">Choose the image you want to crop from your device.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-3 bg-primary/10 rounded-full mb-3 flex items-center justify-center w-12 h-12"><span className="text-2xl font-bold text-primary">2</span></div>
              <h3 className="font-semibold mb-1">Select Area</h3>
              <p className="text-sm text-muted-foreground">Click and drag on the image to select your desired crop area, or choose a preset.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-3 bg-primary/10 rounded-full mb-3 flex items-center justify-center w-12 h-12"><span className="text-2xl font-bold text-primary">3</span></div>
              <h3 className="font-semibold mb-1">Crop & Download</h3>
              <p className="text-sm text-muted-foreground">Click 'Crop Image' to see the result, then download your perfectly cropped photo for free.</p>
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
