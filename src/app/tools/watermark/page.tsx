
'use client';

import { Award, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function WatermarkPage() {
  return (
    <div className="space-y-16 flex flex-col items-center justify-center text-center py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative isolate overflow-hidden bg-background px-6 py-12 text-center sm:px-16 sm:py-24 rounded-2xl shadow-xl">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),white)] dark:bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.900),theme(colors.slate.900))] opacity-20"></div>
            <div className="absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 transform-gpu overflow-hidden opacity-30 blur-3xl" aria-hidden="true">
                <div className="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
            </div>
            <div className="mx-auto max-w-2xl space-y-6">
                <div className="inline-block rounded-full bg-primary/10 p-4">
                    <Award className="h-12 w-12 text-primary" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight md:text-5xl font-headline">
                Watermark Tool
                </h1>
                <div className="inline-flex items-center gap-2 rounded-full bg-yellow-100 dark:bg-yellow-900/50 px-4 py-1 text-yellow-800 dark:text-yellow-300">
                    <Clock className="h-4 w-4"/>
                    <span className="font-semibold">Coming Soon!</span>
                </div>
                <p className="mt-6 text-lg leading-8 text-muted-foreground">
                We're hard at work building this feature. Soon you'll be able to easily add text or image watermarks to protect your photos. Customize the position, size, opacity, and more to safeguard your creative work.
                </p>
                <Button asChild size="lg">
                    <Link href="/features">Explore Other Tools</Link>
                </Button>
            </div>
        </div>
      </motion.div>
    </div>
  );
}
