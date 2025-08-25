"use client";

import { ThemeProvider } from "next-themes";
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { SessionProvider as SessionContextProvider } from "@/lib/contexts/session-context";
import React, { ReactNode, FC } from "react";

const CustomSessionProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <NextAuthSessionProvider>
      <SessionContextProvider>
        {children}
      </SessionContextProvider>
    </NextAuthSessionProvider>
  );
};

export const Providers: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <CustomSessionProvider>
        {children}
      </CustomSessionProvider>
    </ThemeProvider>
  );
};
