
'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FAQ } from '@/components/faq';
import { FileUploader } from '@/components/file-uploader';
import { Card, CardContent } from '@/components/ui/card';
import { UploadCloud, Download, X, Bold, Italic, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Toggle } from '@/components/ui/toggle';
import { useToast } from '@/hooks/use-toast';
import { SampleImage, SampleImagePicker } from '@/components/sample-image-picker';

const faqItems = [
    {
        question: "How do I move the text?",
        answer: "Simply click and drag the top or bottom text directly on the image preview to position it exactly where you want it."
    },
    {
        question: "What is the best font for memes?",
        answer: "The classic meme font is 'Impact', which is what we use by default. It's bold, easy to read, and typically white with a black outline, ensuring it stands out against any background."
    },
    {
        question: "Can I use my own images to make a meme?",
        answer: "Yes, absolutely! Upload any image you want from your device to use as the background for your meme."
    },
];

const fonts = ['Impact', 'Arial', 'Helvetica', 'Comic Sans MS', 'Times New Roman', 'Verdana'];

const sampleImages: SampleImage[] = [
    { url: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800&q=80', description: 'Confused Cat' },
    { url: 'https://images.unsplash.com/photo-1527702581229-598913c330b6?w=800&q=80', description: 'Surprised Dog' },
    { url: 'https://images.unsplash.com/photo-1453227588686-3cf33a4f8b1?w=800&q=80', description: 'Thinking Man' },
];


export default function MemeGeneratorPage() {
  const [topText, setTopText] = useState('Top Text');
  const [bottomText, setBottomText] = useState('Bottom Text');
  const [textColor, setTextColor] = useState('#ffffff');
  const [fontSize, setFontSize] = useState(48);
  const [fontFamily, setFontFamily] = useState('Impact');
  const [isBold, setIsBold] = useState(true);
  const [isItalic, setIsItalic] = useState(false);
  const { toast } = useToast();

  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [textPositions, setTextPositions] = useState<{ 
    top: { x: number; y: number }; 
    bottom: { x: number; y: number }; 
  } | null>(null);

  const [dragging, setDragging] = useState<'top' | 'bottom' | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !image || !textPositions) return;

    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    
    ctx.drawImage(image, 0, 0);
    
    const style = `${isItalic ? 'italic ' : ''}${isBold ? 'bold ' : ''}`;
    ctx.font = `${style}${fontSize}px ${fontFamily}`;
    ctx.fillStyle = textColor;
    ctx.strokeStyle = 'black';
    ctx.lineWidth = Math.max(1, fontSize / 20);
    ctx.textAlign = 'center';
    
    // Top text
    ctx.textBaseline = 'top';
    ctx.strokeText(topText, textPositions.top.x, textPositions.top.y);
    ctx.fillText(topText, textPositions.top.x, textPositions.top.y);

    // Bottom text
    ctx.textBaseline = 'bottom';
    ctx.strokeText(bottomText, textPositions.bottom.x, textPositions.bottom.y);
    ctx.fillText(bottomText, textPositions.bottom.x, textPositions.bottom.y);

  }, [image, topText, bottomText, textColor, fontSize, textPositions, fontFamily, isBold, isItalic]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const onFileLoad = (file: File) => {
    const img = new window.Image();
    img.onload = () => {
      setImage(img);
      setOriginalFile(file);
      setTextPositions({
        top: { x: img.naturalWidth / 2, y: 20 },
        bottom: { x: img.naturalWidth / 2, y: img.naturalHeight - 20 }
      });
    };
    img.src = URL.createObjectURL(file);
  };
  
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) throw new Error("Canvas not found");
    drawCanvas(); 
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `pixelpro_meme_${originalFile?.name || 'image.png'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(dataUrl);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas || !textPositions) return;
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (canvas.width / rect.width);
      const y = (e.clientY - rect.top) * (canvas.height / rect.height);

      const ctx = canvas.getContext('2d')!;
      ctx.font = `bold ${fontSize}px Impact`;

      // Check top text
      const topW = ctx.measureText(topText).width;
      if (x > textPositions.top.x - topW / 2 && x < textPositions.top.x + topW / 2 && y > textPositions.top.y && y < textPositions.top.y + fontSize) {
          setDragging('top');
          dragOffset.current = { x: x - textPositions.top.x, y: y - textPositions.top.y };
          return;
      }

      // Check bottom text
      const bottomW = ctx.measureText(bottomText).width;
      if (x > textPositions.bottom.x - bottomW / 2 && x < textPositions.bottom.x + bottomW / 2 && y < textPositions.bottom.y && y > textPositions.bottom.y - fontSize) {
          setDragging('bottom');
          dragOffset.current = { x: x - textPositions.bottom.x, y: y - textPositions.bottom.y };
          return;
      }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!dragging || !textPositions) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (canvas.width / rect.width);
      const y = (e.clientY - rect.top) * (canvas.height / rect.height);
      
      setTextPositions(prev => (prev ? {
          ...prev,
          [dragging]: {
              x: x - dragOffset.current.x,
              y: y - dragOffset.current.y
          }
      } : null));
  };

  const handleMouseUp = () => setDragging(null);
  
  const resetAll = () => {
    setTopText('Top Text');
    setBottomText('Bottom Text');
    setFontSize(48);
    setFontFamily('Impact');
    setTextColor('#ffffff');
    setIsBold(true);
    setIsItalic(false);
    if(image){
        setTextPositions({
            top: { x: image.naturalWidth / 2, y: 20 },
            bottom: { x: image.naturalWidth / 2, y: image.naturalHeight - 20 }
        });
    }
  }

  const handleReset = () => {
    setImage(null);
    setOriginalFile(null);
    setTextPositions(null);
    resetAll();
  }

  const handleTrySample = async (sample: SampleImage) => {
    handleReset();
    try {
      const response = await fetch(sample.url);
      const blob = await response.blob();
      const file = new File([blob], `sample-${sample.description.toLowerCase().replace(' ','-')}.jpg`, { type: "image/jpeg" });
      onFileLoad(file);
    } catch (err) {
      toast({ title: "Failed to load sample", description: "Could not fetch the sample image.", variant: "destructive"});
    }
  };
  
  return (
    <div className="space-y-16">
        <div className="relative isolate overflow-hidden bg-background px-6 py-12 text-center sm:px-16 sm:py-24" style={{backgroundImage: 'radial-gradient(at 0% 0%, hsla(253, 100%, 70%, 0.1), transparent 50%), radial-gradient(at 100% 0%, hsla(339, 100%, 70%, 0.1), transparent 50%)'}}>
            <div className="mx-auto max-w-2xl">
                <h1 className="text-3xl font-bold tracking-tight md:text-5xl font-headline">Meme Generator</h1>
                <p className="mt-6 text-lg leading-8 text-muted-foreground">Become an internet legend. Add classic meme text to any image, customize fonts, and share your creation.</p>
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
                    <h3 className="font-semibold text-center mb-2">Meme Canvas</h3>
                     <div className="w-full rounded-md overflow-hidden relative bg-muted flex items-center justify-center">
                        {image ? (
                            <canvas
                                ref={canvasRef}
                                className="max-w-full h-auto object-contain cursor-grab"
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                            />
                        ) : <p className="text-muted-foreground">Upload an image to start</p>}
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
                        <div className="space-y-2">
                          <Label htmlFor="top-text">Top Text</Label>
                          <Input id="top-text" value={topText} onChange={(e) => setTopText(e.target.value)} disabled={!image} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bottom-text">Bottom Text</Label>
                          <Input id="bottom-text" value={bottomText} onChange={(e) => setBottomText(e.target.value)} disabled={!image} />
                        </div>

                         <div className="space-y-2">
                            <Label>Font</Label>
                             <Select value={fontFamily} onValueChange={setFontFamily} disabled={!image}>
                                <SelectTrigger><SelectValue placeholder="Choose a font" /></SelectTrigger>
                                <SelectContent>
                                    {fonts.map(font => <SelectItem key={font} value={font}>{font}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Font Size</Label>
                                <Input type="number" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value, 10))} disabled={!image}/>
                            </div>
                            <div className="space-y-2">
                                <Label>Text Color</Label>
                                <Input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-full h-10 p-1" disabled={!image}/>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Font Style</Label>
                             <div className="flex gap-2">
                                <Toggle pressed={isBold} onPressedChange={setIsBold} aria-label="Toggle bold"><Bold className="h-4 w-4" /></Toggle>
                                <Toggle pressed={isItalic} onPressedChange={setIsItalic} aria-label="Toggle italic"><Italic className="h-4 w-4" /></Toggle>
                            </div>
                        </div>

                        <Button variant="secondary" onClick={resetAll} disabled={!image}>Reset Controls</Button>
                        
                        <Button
                            onClick={handleDownload}
                            disabled={!image}
                            className="w-full"
                        >
                            <Download className="mr-2 h-4 w-4"/>
                            Download Meme
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
      )}

       <div className="w-full max-w-6xl mx-auto space-y-12 mt-16">
        <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">Why Use Our Meme Generator?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 border rounded-lg">
                <Zap className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Instant Creation</h3>
                <p className="text-muted-foreground">See your meme come to life as you type. What you see is what you get, instantly.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 border rounded-lg">
                <ShieldCheck className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">100% Private & Free</h3>
                <p className="text-muted-foreground">Everything happens in your browser. Your images are never uploaded, and the tool is free forever.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 border rounded-lg">
                <Sparkles className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Total Customization</h3>
                <p className="text-muted-foreground">Go beyond the basics. Drag text, change fonts, colors, and styles to make your meme unique.</p>
            </div>
        </div>
        <section className="bg-secondary p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 font-headline text-center">How to Make a Meme</h2>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="p-3 bg-primary/10 rounded-full mb-3 flex items-center justify-center w-12 h-12"><span className="text-2xl font-bold text-primary">1</span></div>
              <h3 className="font-semibold mb-1">Upload an Image</h3>
              <p className="text-sm text-muted-foreground">Choose a funny picture from your device to serve as the meme template.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-3 bg-primary/10 rounded-full mb-3 flex items-center justify-center w-12 h-12"><span className="text-2xl font-bold text-primary">2</span></div>
              <h3 className="font-semibold mb-1">Add Your Text</h3>
              <p className="text-sm text-muted-foreground">Write your hilarious top and bottom text captions. Drag them on the image to position.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-3 bg-primary/10 rounded-full mb-3 flex items-center justify-center w-12 h-12"><span className="text-2xl font-bold text-primary">3</span></div>
              <h3 className="font-semibold mb-1">Download and Share</h3>
              <p className="text-sm text-muted-foreground">Click 'Download' to save your meme and share it with the world.</p>
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

    