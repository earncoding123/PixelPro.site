'use client';

import Link from 'next/link';
import { Menu, Mountain, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { TOOLS } from '@/lib/constants';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';

export function Header() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Mountain className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block">PixelPro</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1">
                  Tools
                  <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {TOOLS.map((tool) => (
                  <DropdownMenuItem key={tool.href} asChild>
                    <Link href={tool.href}>
                      <tool.icon className="mr-2 h-4 w-4" />
                      {tool.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
             <Link
              href="/features"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Features
            </Link>
            <Link
              href="/about"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Contact
            </Link>
          </nav>
        </div>

        {/* Mobile Header */}
        <div className="flex w-full items-center justify-between md:hidden">
           <Link href="/" className="flex items-center space-x-2">
            <Mountain className="h-6 w-6 text-primary" />
            <span className="font-bold">PixelPro</span>
          </Link>
          <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
              <SheetHeader className="sr-only">
                <SheetTitle>Mobile Navigation Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b">
                   <Link href="/" onClick={closeMobileMenu} className="flex items-center space-x-2">
                    <Mountain className="h-6 w-6 text-primary" />
                    <span className="font-bold">PixelPro</span>
                  </Link>
                </div>
                <ScrollArea className="flex-grow">
                  <div className="p-4">
                    <nav className="flex flex-col space-y-4 text-lg">
                      {TOOLS.map((tool) => (
                        <Link
                          key={tool.href}
                          href={tool.href}
                          onClick={closeMobileMenu}
                          className={cn(
                            'flex items-center gap-2 rounded-md p-2 transition-colors hover:bg-accent',
                            pathname === tool.href && 'bg-accent text-accent-foreground'
                          )}
                        >
                          <tool.icon className="h-5 w-5" />
                          {tool.name}
                        </Link>
                      ))}
                      <Link
                          href="/features"
                          onClick={closeMobileMenu}
                          className={cn(
                            'flex items-center gap-2 rounded-md p-2 transition-colors hover:bg-accent',
                            pathname === '/features' && 'bg-accent text-accent-foreground'
                          )}
                        >
                          Features
                        </Link>
                      <Link
                          href="/about"
                          onClick={closeMobileMenu}
                          className={cn(
                            'flex items-center gap-2 rounded-md p-2 transition-colors hover:bg-accent',
                            pathname === '/about' && 'bg-accent text-accent-foreground'
                          )}
                        >
                          About
                        </Link>
                        <Link
                          href="/contact"
                          onClick={closeMobileMenu}
                          className={cn(
                            'flex items-center gap-2 rounded-md p-2 transition-colors hover:bg-accent',
                            pathname === '/contact' && 'bg-accent text-accent-foreground'
                          )}
                        >
                          Contact
                        </Link>
                    </nav>
                  </div>
                </ScrollArea>
                <div className="p-4 border-t flex flex-col space-y-2">
                  <Button asChild><Link href="/features" onClick={closeMobileMenu}>Get Started</Link></Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>


        <div className="flex flex-1 items-center justify-end space-x-2">
          <div className="hidden md:flex">
            <Button asChild>
              <Link href="/features">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
