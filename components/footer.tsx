import Link from "next/link";
import { AudioWaveform } from "lucide-react";
import { Container } from "./ui/container";

const footerNavs = [
  {
    href: "/about",
    label: "About",
  },
  {
    href: "/features",
    label: "Features",
  },
  {
    href: "/contact",
    label: "Contact",
  },
  {
    href: "/terms",
    label: "Terms",
  },
  {
    href: "/privacy",
    label: "Privacy",
  },
];

export function Footer() {
  return (
    <footer className="border-t">
      <Container>
        <div className="py-10 md:flex items-center justify-between">
          <div className="mb-6 md:mb-0">
            <Link
              href="/"
              className="flex items-center transition-opacity hover:opacity-80 space-x-2"
            >
              <AudioWaveform className="h-6 w-6 text-primary" />
              <span className="font-semibold text-lg">Aitherpy</span>
            </Link>
            <p className="mt-2 max-w-xs text-sm text-muted-foreground">
              Your personal AI companion for mental wellness.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {footerNavs.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="py-6 border-t text-center text-sm text-muted-foreground">
          © 2025 Aitherpy. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}
