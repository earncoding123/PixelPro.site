'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileUploader } from '@/components/file-uploader';
import { FeatureGrid } from '@/components/landing/feature-grid';
import { BeforeAfterSlider } from '@/components/ui/before-after-slider';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { motion } from 'framer-motion';
import { UploadCloud, Zap, Target, Palette, ArrowRight } from 'lucide-react';
import { FAQ } from '@/components/faq';
import Link from 'next/link';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { TOOLS } from '@/lib/constants';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

const homeFaqs = [
  {
    question: "Is PixelPro completely free to use?",
    answer: "Yes, all our image editing tools, including the background remover, image compressor, and AI upscaler, are completely free. There are no hidden charges or subscriptions."
  },
  {
    question: "Do I need to create an account?",
    answer: "No, you can use all our tools without creating an account. Just upload your image and start editing right away. We believe in providing a quick and hassle-free experience."
  },
  {
    question: "What happens to my uploaded images?",
    answer: "We prioritize your privacy. Your images are processed on our servers and are automatically deleted after a short period. We do not store your files or use them for any other purpose."
  },
  {
    question: "What file formats do you support?",
    answer: "Our tools support all major image formats, including JPG, PNG, and WEBP. For the best results, especially with background removal, we recommend using a high-quality image where the subject is clearly visible."
  }
];

export default function Home() {
  const router = useRouter();
  const [isToolSelectorOpen, setToolSelectorOpen] = useState(false);

  const handleFileSelect = (file: File | File[]) => {
    const selectedFile = Array.isArray(file) ? file[0] : file;
    if(!selectedFile) return;

    const fileReader = new FileReader();
    fileReader.onload = () => {
      sessionStorage.setItem('initialImage', fileReader.result as string);
      setToolSelectorOpen(true);
    };
    fileReader.readAsDataURL(selectedFile);
  };
  
  const beforeImage = PlaceHolderImages.find(img => img.id === 'car-before');
  const afterImage = PlaceHolderImages.find(img => img.id === 'car-after');

  const handleToolSelect = (href: string) => {
    setToolSelectorOpen(false);
    router.push(href);
  };

  return (
    <div className="flex flex-col items-center">
       <section className="w-full py-20 md:py-32">
        <div className="container grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
              Free AI Image Editor & BG Remover
            </h1>
            <p className="max-w-[600px] text-muted-foreground md:text-xl">
              Instantly remove backgrounds, compress files, and enhance photos with our suite of free online image editing tools. Get professional results with the power of AI, no account required.
            </p>
            <Card className="shadow-lg">
              <CardContent className="p-4">
                <FileUploader onFileSelect={handleFileSelect}>
                  <div className="text-center p-8 flex flex-col items-center justify-center space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-full p-6 bg-accent">
                      <UploadCloud className="w-12 h-12 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">Click or Drag & Drop an Image</h2>
                      <p className="text-muted-foreground mt-1">
                        to start editing with our free AI tools.
                      </p>
                    </div>
                     <Button size="lg">Upload Image</Button>
                  </div>
                </FileUploader>
              </CardContent>
            </Card>
          </motion.div>
          
          {beforeImage && afterImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <BeforeAfterSlider
                before={<Image src={beforeImage.imageUrl} alt="Car on a street" width={800} height={600} data-ai-hint={beforeImage.imageHint} />}
                after={<Image src={afterImage.imageUrl} alt="Car with background removed" width={800} height={600} data-ai-hint={afterImage.imageHint}/>}
              />
            </motion.div>
          )}
        </div>
      </section>

      <Dialog open={isToolSelectorOpen} onOpenChange={setToolSelectorOpen}>
        <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] flex flex-col p-0">
          <DialogHeader className="p-6 pb-4 flex-shrink-0">
            <DialogTitle className="text-2xl font-bold">Choose Your Tool</DialogTitle>
            <DialogDescription>
              Your image is ready. Select an editing tool to get started.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6 pt-0 pb-10">
              {TOOLS.map((tool) => (
                <button
                  key={tool.href}
                  onClick={() => !tool.disabled && handleToolSelect(tool.href)}
                  disabled={tool.disabled}
                  className={cn(
                    "group flex flex-col rounded-lg border bg-card p-4 text-left transition-all duration-200",
                    tool.disabled 
                      ? "cursor-not-allowed opacity-50 bg-secondary" 
                      : "hover:border-primary/50 hover:shadow-lg hover:-translate-y-1"
                  )}
                >
                  <div className="mb-3 rounded-full bg-primary/10 p-2 self-start">
                    <tool.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-card-foreground">{tool.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground flex-grow">{tool.description}</p>
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>


      <section className="w-full py-20 md:py-24 lg:py-32 bg-secondary">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">A Full Suite of Tools</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-2">
              Everything you need for professional image editing, powered by AI.
            </p>
          </div>
          <FeatureGrid />
        </div>
      </section>
      
      <section className="w-full py-20 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
           <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">How It Works</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-2">
              Editing your images has never been this simple. Follow three easy steps.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-primary/10 rounded-full"><UploadCloud className="w-8 h-8 text-primary" /></div>
              <h3 className="text-xl font-semibold">1. Upload Your Image</h3>
              <p className="text-muted-foreground">Drag and drop your file or click to browse. Your image is uploaded securely.</p>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-primary/10 rounded-full"><Zap className="w-8 h-8 text-primary" /></div>
              <h3 className="text-xl font-semibold">2. Choose Your Tool</h3>
              <p className="text-muted-foreground">Select a tool like the Background Remover, AI Upscaler, or Image Compressor from our suite.</p>
            </div>
            <div className="flex flex-col items-center space-y-4">
               <div className="p-4 bg-primary/10 rounded-full"><Palette className="w-8 h-8 text-primary" /></div>
              <h3 className="text-xl font-semibold">3. Edit & Download</h3>
              <p className="text-muted-foreground">Our AI processes your image instantly. Download your perfectly edited photo for free.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-20 md:py-24 lg:py-32 bg-secondary">
        <div className="container px-4 md:px-6 max-w-4xl">
           <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">Frequently Asked Questions</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-2">
              Have questions? We've got answers. Here are some of the most common things we get asked.
            </p>
          </div>
          <FAQ items={homeFaqs} />
           <div className="mt-16 text-center bg-background p-10 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold tracking-tight font-headline">Ready to Elevate Your Images?</h2>
            <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
              Jump in and start creating stunning visuals with our full suite of AI-powered tools. No account required, completely free.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/features">
                  Explore All Tools <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
