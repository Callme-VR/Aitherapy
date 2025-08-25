"use client";

import Link from "next/link";
import { AudioWaveform, LogOut, Menu, MessageCircle, X } from "lucide-react";
import ThemeToggle from "./theme-toggle";
import { useState } from "react";
import { Button } from "./ui/button";
import UserNav from "./auth/user-nav";
import MobileNav from "./auth/mobile-nav";

export default function Header() {
  const navItems = [
    { href: "/features", label: "Features" },
    { href: "/about", label: "About" },
  ];

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="w-full fixed top-0 z-50 bg-background/95 backdrop-blur">
      <div className="absolute inset-0 border-b border-primary/10">
        <header className="relative max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center transition-opacity hover:opacity-80 space-x-2">
              <AudioWaveform className="h-6 w-6 text-primary animate-pulse-gentle" />
              <span className="font-semibold text-lg bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Aitherpy
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <UserNav />
              <Button
                variant="ghost"
                className="md:hidden"
                size="icon"
                onClick={() => setIsMenuOpen((prev) => !prev)}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <MobileNav
              navItems={navItems}
              onLinkClick={() => setIsMenuOpen(false)}
            />
          )}
        </header>
      </div>
    </div>
  );
}
