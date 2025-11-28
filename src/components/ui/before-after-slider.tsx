
"use client";

import { useState, useRef, useEffect } from "react";
import type { ImageProps } from "next/image";
import { cn } from "@/lib/utils";
import { Grip } from "lucide-react";
import React from 'react';

interface BeforeAfterSliderProps extends React.HTMLAttributes<HTMLDivElement> {
  before: React.ReactElement<ImageProps>;
  after: React.ReactElement<ImageProps>;
}

export const BeforeAfterSlider = ({
  before,
  after,
  className,
  ...props
}: BeforeAfterSliderProps) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isInteracting, setIsInteracting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    let startTime: number;
    const duration = 6000; // 6 seconds for one full cycle (left to right and back)

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = (elapsed % duration) / duration;
      
      // Use a sine wave for smooth back-and-forth motion
      const newPosition = 50 * (1 + Math.sin(progress * 2 * Math.PI - Math.PI / 2));
      
      setSliderPosition(newPosition);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    if (!isInteracting) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isInteracting]);

  const handleInteractionStart = () => {
    setIsInteracting(true);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };
  
  const handleInteractionEnd = () => {
    setIsInteracting(false);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value));
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full aspect-[4/3] overflow-hidden rounded-lg group", className)}
      onMouseEnter={handleInteractionStart}
      onMouseLeave={handleInteractionEnd}
      onTouchStart={handleInteractionStart}
      onTouchEnd={handleInteractionEnd}
      {...props}
    >
      <div className="absolute inset-0 w-full h-full bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAACJJREFUOE9jfPbs2X8GPEBTUwOCg4MCAgJGk4iA8J8wYgMARpsA4gEAXEM3eY1hH9sAAAAASUVORK5CYII=')] bg-repeat">
        {React.cloneElement(before, {
          className: "absolute inset-0 w-full h-full object-cover select-none",
          alt: before.props.alt || "Before image",
        })}
      </div>
      <div
        className="absolute inset-0 w-full h-full overflow-hidden select-none"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <div className="absolute inset-0 w-full h-full bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAACJJREFUOE9jfPbs2X8GPEBTUwOCg4MCAgJGk4iA8J8wYgMARpsA4gEAXEM3eY1hH9sAAAAASUVORK5CYII=')] bg-repeat">
            {React.cloneElement(after, {
              className: "absolute inset-0 w-full h-full object-cover select-none",
              alt: after.props.alt || "After image",
            })}
        </div>
      </div>
      <div
        className="absolute inset-y-0 w-1 bg-white/50 cursor-ew-resize transition-opacity duration-300 group-hover:opacity-100 opacity-0"
        style={{ left: `calc(${sliderPosition}% - 2px)` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2 bg-primary rounded-full text-primary-foreground shadow-md">
          <Grip className="w-4 h-4 rotate-90" />
        </div>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={sliderPosition}
        onChange={handleSliderChange}
        className="absolute inset-0 w-full h-full cursor-ew-resize opacity-0"
        aria-label="Before and after image slider"
      />
    </div>
  );
};
