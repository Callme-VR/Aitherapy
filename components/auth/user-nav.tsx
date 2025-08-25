"use client";

import Link from "next/link";
import { LogOut, MessageCircle } from "lucide-react";
import { useSession } from "@/lib/contexts/session-context";
import { Button } from "@/components/ui/button";
import SignInButton from "./sign-in-button";

export default function UserNav() {
  const { isAuthenticated, logout } = useSession();

  if (!isAuthenticated) {
    return <SignInButton />;
  }

  return (
    <div className="flex items-center gap-2">
      <Button asChild variant="ghost" className="hidden sm:inline-flex">
        <Link href="/dashboard" className="flex items-center">
          <MessageCircle className="h-4 w-4 mr-2" />
          <span>Start Chat</span>
        </Link>
      </Button>
      <Button
        variant="outline"
        onClick={logout}
        className="text-muted-foreground hover:text-foreground transition-colors hidden sm:flex items-center"
      >
        <LogOut className="h-4 w-4 mr-2" />
        <span>Sign Out</span>
      </Button>
    </div>
  );
}
