import Link from 'next/link';
import { Mountain, Twitter, Github, Linkedin } from 'lucide-react';
import { TOOLS } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto grid grid-cols-1 gap-8 px-4 py-12 md:grid-cols-4 md:px-6">
        <div className="flex flex-col items-start space-y-4">
          <Link href="/" className="flex items-center space-x-2">
            <Mountain className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">PixelPro</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            Edit images with the power of AI. Simple, fast, and effective.
          </p>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase">Tools</h3>
          <ul className="space-y-2">
            {TOOLS.map((tool) => (
              <li key={tool.href}>
                <Link
                  href={tool.href}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  <tool.icon className="h-4 w-4" />
                  <span>{tool.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase">Company</h3>
          <ul className="space-y-2">
            <li>
              <Link
                href="/about"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="/features"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Features
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase">Legal</h3>
          <ul className="space-y-2">
            <li>
              <Link
                href="/privacy"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href="/terms"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 border-t px-4 py-6 md:flex-row md:px-6">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} PixelPro. All rights reserved.
        </p>
        <div className="flex items-center space-x-4">
          <Link href="#" className="text-muted-foreground hover:text-foreground">
            <Twitter className="h-5 w-5" />
          </Link>
          <Link href="#" className="text-muted-foreground hover:text-foreground">
            <Github className="h-5 w-5" />
          </Link>
          <Link href="#" className="text-muted-foreground hover:text-foreground">
            <Linkedin className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
