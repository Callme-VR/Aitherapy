"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "@/lib/contexts/session-context";
import { Toaster } from "@/components/ui/toaster";

export function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <Toaster />
      </ThemeProvider>
    </SessionProvider>
  );
}
