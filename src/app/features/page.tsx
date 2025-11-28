
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TOOLS } from '@/lib/constants';
import { ArrowRight } from 'lucide-react';
import { BeforeAfterSlider } from '@/components/ui/before-after-slider';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';

export default function FeaturesPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 font-headline">A Full Suite of Editing Tools</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Everything you need for professional image editing, powered by AI. Simple, fast, and free to use.
        </p>
      </motion.div>

      <div className="space-y-24">
        {TOOLS.map((tool, i) => {
          const beforeImage = PlaceHolderImages.find(img => img.id === tool.beforeImage);
          const afterImage = PlaceHolderImages.find(img => img.id === tool.afterImage);
          const isReversed = i % 2 !== 0;

          return (
            <motion.div
              key={tool.href}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className={cn(
                "grid grid-cols-1 lg:grid-cols-2 gap-12 items-center",
                isReversed && "lg:grid-flow-col-dense"
              )}
            >
              <div className={cn(
                "space-y-4",
                isReversed && "lg:col-start-2"
              )}>
                <div className="inline-flex items-center gap-3">
                   <div className="p-2 bg-primary/10 rounded-full">
                     <tool.icon className="h-6 w-6 text-primary" />
                   </div>
                  <h2 className="text-3xl font-bold font-headline tracking-tight">{tool.name}</h2>
                </div>
                <p className="text-lg text-muted-foreground">{tool.description}</p>
                <Button asChild size="lg">
                  <Link href={tool.href}>
                    Try It Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              {beforeImage && afterImage && (
                <div className={cn(isReversed && "lg:col-start-1")}>
                  <BeforeAfterSlider
                    before={<Image src={beforeImage.imageUrl} alt={beforeImage.description} width={800} height={600} data-ai-hint={beforeImage.imageHint} />}
                    after={<Image src={afterImage.imageUrl} alt={afterImage.description} width={800} height={600} data-ai-hint={afterImage.imageHint}/>}
                  />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
