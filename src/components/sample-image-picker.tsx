'use client';

import Image from 'next/image';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

export type SampleImage = {
  url: string;
  description: string;
};

type SampleImagePickerProps = {
  samples: SampleImage[];
  onSelect: (sample: SampleImage) => void;
  className?: string;
};

export function SampleImagePicker({ samples, onSelect, className }: SampleImagePickerProps) {
  if (!samples || samples.length === 0) {
    return null;
  }

  return (
    <div className={cn("mt-4 pt-4 border-t", className)}>
      <div className="flex items-center justify-center gap-4">
        <div className="text-right">
          <p className="text-sm text-muted-foreground">No image?</p>
          <p className="text-sm text-muted-foreground">Try one of these</p>
        </div>
        <div className="flex gap-2">
          {samples.slice(0, 4).map((sample) => (
            <button
              key={sample.url}
              onClick={() => onSelect(sample)}
              className="relative h-14 w-14 rounded-lg overflow-hidden group transition-transform duration-200 hover:scale-105"
            >
              <Image 
                src={sample.url} 
                alt={sample.description} 
                layout="fill" 
                objectFit="cover" 
                sizes="56px"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
