<<<<<<< HEAD
'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function TermsOfServicePage() {
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    setLastUpdated(new Date().toLocaleDateString());
  }, []);

=======

'use client';

import { motion } from 'framer-motion';

export default function TermsOfServicePage() {
>>>>>>> 3d22b1f70e46f9b27876a64621858138cbc3d477
  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 font-headline">Terms of Service</h1>
<<<<<<< HEAD
        <p className="text-lg md:text-xl text-muted-foreground">Last Updated: {lastUpdated}</p>
=======
        <p className="text-lg md:text-xl text-muted-foreground">Last Updated: {new Date().toLocaleDateString()}</p>
>>>>>>> 3d22b1f70e46f9b27876a64621858138cbc3d477
      </motion.div>

      <div className="max-w-4xl mx-auto space-y-8 text-muted-foreground">
        <section>
          <h2 className="text-2xl font-bold mb-4 text-foreground">1. Acceptance of Terms</h2>
          <p>
<<<<<<< HEAD
            By accessing and using FreeBg, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this service.
=======
            By accessing and using PixelPro, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this service.
>>>>>>> 3d22b1f70e46f9b27876a64621858138cbc3d477
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-foreground">2. Service Description</h2>
          <p>
<<<<<<< HEAD
            FreeBg provides a suite of AI-powered image editing tools. The service is provided "as is" and we reserve the right to modify or discontinue the service at any time without notice.
=======
            PixelPro provides a suite of AI-powered image editing tools. The service is provided "as is" and we reserve the right to modify or discontinue the service at any time without notice.
>>>>>>> 3d22b1f70e46f9b27876a64621858138cbc3d477
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-foreground">3. User Conduct</h2>
          <p>
            You agree not to use the service to upload or process any content that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable. You are solely responsible for the content you upload and the consequences of sharing it.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold mb-4 text-foreground">4. Intellectual Property</h2>
          <p>
<<<<<<< HEAD
            You retain all ownership rights to the images you upload. We do not claim any ownership over your content. The software, text, graphics, and other content on FreeBg are the property of FreeBg and are protected by intellectual property laws.
=======
            You retain all ownership rights to the images you upload. We do not claim any ownership over your content. The software, text, graphics, and other content on PixelPro are the property of PixelPro and are protected by intellectual property laws.
>>>>>>> 3d22b1f70e46f9b27876a64621858138cbc3d477
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-foreground">5. Limitation of Liability</h2>
          <p>
<<<<<<< HEAD
            In no event shall FreeBg be liable for any direct, indirect, incidental, special, or consequential damages arising out of or in connection with your use of the service.
=======
            In no event shall PixelPro be liable for any direct, indirect, incidental, special, or consequential damages arising out of or in connection with your use of the service.
>>>>>>> 3d22b1f70e46f9b27876a64621858138cbc3d477
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold mb-4 text-foreground">6. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Your continued use of the service after any such changes constitutes your acceptance of the new terms.
<<<<<<< HEAD
          </p>
=======
         </p>
>>>>>>> 3d22b1f70e46f9b27876a64621858138cbc3d477
        </section>
      </div>
    </div>
  );
}
