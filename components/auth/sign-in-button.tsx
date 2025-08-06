"use client";

import Link from "next/link";
import { Button } from "../ui/button";

interface signInButtonProps {
  className?: string;
}

export default function SignInButton({ className }: signInButtonProps) {
  return (
    <Button asChild className={className}>
      <Link href="/login">Sign In</Link>
    </Button>
  );
}
