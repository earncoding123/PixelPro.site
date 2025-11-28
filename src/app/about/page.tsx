'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
<<<<<<< HEAD
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 font-headline">About FreeBg</h1>
=======
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 font-headline">About PixelPro</h1>
>>>>>>> 3d22b1f70e46f9b27876a64621858138cbc3d477
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          We are on a mission to make professional-grade image editing accessible to everyone through the power of artificial intelligence.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold mb-4 font-headline">Our Vision</h2>
          <p className="text-muted-foreground mb-4">
<<<<<<< HEAD
            FreeBg was born from a simple idea: creative potential shouldn't be limited by complex software or tedious manual tasks. We envision a world where anyone, from professional photographers to small business owners and social media enthusiasts, can create stunning visuals in just a few clicks.
=======
            PixelPro was born from a simple idea: creative potential shouldn't be limited by complex software or tedious manual tasks. We envision a world where anyone, from professional photographers to small business owners and social media enthusiasts, can create stunning visuals in just a few clicks.
>>>>>>> 3d22b1f70e46f9b27876a64621858138cbc3d477
          </p>
          <p className="text-muted-foreground">
            Our team of developers, designers, and AI researchers are passionate about building intuitive tools that automate the most time-consuming parts of image editing, allowing you to focus on what matters most—your creativity.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="relative aspect-video rounded-lg overflow-hidden shadow-xl"
        >
          <Image 
            src="https://picsum.photos/seed/teamwork/1280/720"
            alt="Team collaborating"
            layout="fill"
            objectFit="cover"
            data-ai-hint="teamwork collaboration"
          />
        </motion.div>
      </div>

      <div className="text-center">
        <h2 className="text-3xl font-bold mb-8 font-headline">What We Offer</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="p-6 bg-secondary rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Simplicity</h3>
            <p className="text-muted-foreground">No more steep learning curves. Upload your image, select a tool, and let our AI do the heavy lifting.</p>
          </div>
          <div className="p-6 bg-secondary rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Speed</h3>
            <p className="text-muted-foreground">Tasks that used to take hours, like background removal, can now be done in seconds, dramatically speeding up your workflow.</p>
          </div>
          <div className="p-6 bg-secondary rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Quality</h3>
            <p className="text-muted-foreground">Powered by cutting-edge AI models, our tools deliver high-quality, professional results every time.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
