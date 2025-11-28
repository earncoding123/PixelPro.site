
'use client';

import React, { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface FileUploaderProps {
  onFileSelect: (file: File | File[]) => void;
  children: React.ReactNode;
  className?: string;
  multiple?: boolean;
}

export function FileUploader({ onFileSelect, children, className, multiple = false }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFiles = useCallback((files: FileList) => {
    const imageFiles: File[] = [];
    for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) {
            toast({
                title: "Invalid file type",
                description: `Skipping non-image file: ${file.name}`,
                variant: "destructive"
            });
            continue;
        }
        imageFiles.push(file);
    }
    
    if (imageFiles.length > 0) {
        if (multiple) {
            onFileSelect(imageFiles);
        } else {
            onFileSelect(imageFiles[0]);
        }
    }

  }, [onFileSelect, toast, multiple]);


  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        handleFiles(files);
      }
    },
    [handleFiles]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Prevent nested buttons from triggering the file input
    if (e.target instanceof HTMLButtonElement || e.target instanceof HTMLAnchorElement) {
        return;
    }
    fileInputRef.current?.click();
  };

  return (
    <div
      onClick={handleClick}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={cn(
        'border-2 border-dashed rounded-lg transition-all duration-300 cursor-pointer',
        'hover:border-primary hover:bg-accent',
        isDragging ? 'border-primary bg-accent' : 'border-border',
        className
      )}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
      />
      {children}
    </div>
  );
}
