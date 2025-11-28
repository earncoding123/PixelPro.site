
'use client';

import { motion } from 'framer-motion';

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 font-headline">Privacy Policy</h1>
        <p className="text-lg md:text-xl text-muted-foreground">Last Updated: {new Date().toLocaleDateString()}</p>
      </motion.div>

      <div className="max-w-4xl mx-auto space-y-8 text-muted-foreground">
        <section>
          <h2 className="text-2xl font-bold mb-4 text-foreground">1. Introduction</h2>
          <p>
            Welcome to PixelPro. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-foreground">2. Information We Collect</h2>
          <p>
            When you use our services, we may collect the images you upload for processing. We do not store your images after processing is complete. The images are temporarily held on our servers to perform the requested edits and are deleted shortly after. We do not collect personal information unless you voluntarily provide it to us, for example, by contacting us via email.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-foreground">3. How We Use Your Information</h2>
          <p>
            The images you upload are used solely for the purpose of providing the image editing services you request. We do not use your images for any other purpose, such as training AI models, without your explicit consent. If you contact us, we will use your information to respond to your inquiry.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-foreground">4. Data Security</h2>
          <p>
            We use administrative, technical, and physical security measures to help protect your information. While we have taken reasonable steps to secure the information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold mb-4 text-foreground">5. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-foreground">6. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at <a href="mailto:support@pixelpro.site" className="text-primary hover:underline">support@pixelpro.site</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
