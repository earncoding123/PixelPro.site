
'use client';

import { useState, useEffect, useCallback, ReactNode } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Download, UploadCloud, X, Loader2 } from 'lucide-react';
import { FileUploader } from './file-uploader';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SampleImage, SampleImagePicker } from './sample-image-picker';


const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

type ProcessResult = {
  url: string;
  originalSize?: number;
  compressedSize?: number;
};

type ToolProcessorProps = {
  processImage: (file: File) => Promise<string | ProcessResult>;
  children: (
    isProcessing: boolean,
    process: () => void
  ) => React.ReactNode;
  onFileSelect?: (file: File) => void;
  showResultPreview?: boolean;
  customPreview?: React.ReactNode;
  downloadFileNameSuffix?: string;
  sampleImages?: SampleImage[];
};

export function ToolProcessor({ 
  processImage, 
  children, 
  onFileSelect, 
  showResultPreview = true,
  customPreview,
  downloadFileNameSuffix = '_processed.png',
  sampleImages,
}: ToolProcessorProps) {
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialImageLoaded, setInitialImageLoaded] = useState(false);
  const [originalSize, setOriginalSize] = useState<number | undefined>();
  const [compressedSize, setCompressedSize] = useState<number | undefined>();
  const [isSuccess, setIsSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('original');
  const { toast } = useToast();

  useEffect(() => {
    const initialImage = sessionStorage.getItem('initialImage');
    if (initialImage && !initialImageLoaded) {
      fetch(initialImage)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], "uploaded_image.png", { type: blob.type });
          handleFileSelect(file);
        });
      setInitialImageLoaded(true);
      sessionStorage.removeItem('initialImage');
    }
    
    return () => {
      if (processedImageUrl && processedImageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(processedImageUrl);
      }
    };
  }, [initialImageLoaded]);

  const handleFileSelect = (file: File) => {
    setOriginalImage(file);
    if (processedImageUrl && processedImageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(processedImageUrl);
    }
    setProcessedImageUrl(null);
    setOriginalSize(file.size);
    setCompressedSize(undefined);
    setError(null);
    setIsSuccess(false);
    setActiveTab('original');

    if(onFileSelect) {
      onFileSelect(file);
    }
  };
  
  const handleProcessImage = useCallback(async (file?: File) => {
    const imageToProcess = file || originalImage;
    if (!imageToProcess) return;

    setIsProcessing(true);
    setError(null);
    setIsSuccess(false);
    if (processedImageUrl && processedImageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(processedImageUrl);
    }
    setProcessedImageUrl(null);
    setActiveTab('result');

    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const result = await processImage(imageToProcess);
      
      if (typeof result === 'string') {
        setProcessedImageUrl(result);
      } else {
        setProcessedImageUrl(result.url);
        if (result.originalSize) setOriginalSize(result.originalSize);
        if (result.compressedSize) setCompressedSize(result.compressedSize);
      }
      setIsSuccess(true);
      toast({
        title: 'Processing Complete!',
        description: 'Your image is ready to be downloaded.',
      });
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      toast({
        title: 'Processing Error',
        description: err.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
      setActiveTab('original'); // Switch back to original tab on error
    } finally {
      setTimeout(() => setIsProcessing(false), 500);
    }
  }, [originalImage, processImage, processedImageUrl, toast]);

  const handleDownload = async () => {
    let urlToDownload = processedImageUrl;
    if (!urlToDownload) {
        toast({
            title: "No Result Found",
            description: "Please process an image first before downloading.",
            variant: "destructive"
        });
        return;
    }
    downloadFile(urlToDownload!);
  };
  
  const downloadFile = (url: string) => {
    const a = document.createElement('a');
    a.href = url;
    const name = originalImage?.name.replace(/\.[^/.]+$/, "") || "image";
    a.download = `${name}${downloadFileNameSuffix}`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  const handleReset = () => {
    setOriginalImage(null);
    if (processedImageUrl && processedImageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(processedImageUrl);
    }
    setProcessedImageUrl(null);
    setError(null);
    setIsProcessing(false);
    setIsSuccess(false);
    setActiveTab('original');
     if (onFileSelect) {
        // Create an empty file to signal reset
        const emptyFile = new File([], "");
        onFileSelect(emptyFile);
    }
  }

  const handleTrySample = async (sample: SampleImage) => {
    handleReset();
    try {
      const response = await fetch(sample.url);
      const blob = await response.blob();
      const file = new File([blob], `sample-${sample.description.toLowerCase()}.jpg`, { type: "image/jpeg" });
      handleFileSelect(file);
    } catch (err) {
      toast({ title: "Failed to load sample", description: "Could not fetch the sample image.", variant: "destructive"});
    }
  };

  return (
    <>
      {!originalImage ? (
        <Card className="w-full max-w-3xl mx-auto">
          <CardContent className="p-4">
            <FileUploader onFileSelect={(file) => handleFileSelect(file)}>
              <div className="text-center p-12">
                <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">Upload an image to get started</h3>
                <p className="mt-1 text-sm text-muted-foreground">Drag and drop or click to browse</p>
              </div>
            </FileUploader>
             {sampleImages && <SampleImagePicker samples={sampleImages} onSelect={handleTrySample} />}
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
                               {originalImage && <Image src={URL.createObjectURL(originalImage)} alt="Original" fill objectFit="contain" />}
                            </div>
                             {originalSize !== undefined && !customPreview && (
                                <div className="text-center text-sm text-muted-foreground font-medium mt-2">Size: {formatBytes(originalSize)}</div>
                            )}
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
                                    {processedImageUrl && showResultPreview ? (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="h-full w-full"
                                        >
                                            <Image src={processedImageUrl} alt="Processed" fill objectFit="contain" />
                                        </motion.div>
                                    ) : customPreview ? (
                                        <div className="h-full w-full flex items-center justify-center">
                                          {customPreview}
                                        </div>
                                    ) : (
                                        !isProcessing && <div className="text-muted-foreground text-center p-4">The result will appear here.</div>
                                    )}
                                </AnimatePresence>
                            </div>
                            {compressedSize !== undefined && (
                                <div className="text-center text-sm text-muted-foreground font-medium mt-2">
                                Size: {formatBytes(compressedSize)} 
                                {originalSize && compressedSize && (originalSize - compressedSize) > 0 && 
                                    <span className="text-green-600 ml-2">(-{Math.round(((originalSize - compressedSize) / originalSize) * 100)}%)</span>
                                }
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                    {error && (
                        <Alert variant="destructive" className="mt-4">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
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
                
                {children(isProcessing, () => handleProcessImage())}

                <Button onClick={handleDownload} disabled={isProcessing} className={cn("w-full h-12", isSuccess && "bg-green-500 hover:bg-green-600")}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Image
                </Button>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )}
    </>
  );
}
