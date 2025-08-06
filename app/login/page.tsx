"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, Mail } from "lucide-react";
import { div } from "framer-motion/client";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/40">
      <Container className="flex flex-col items-center justify-center w-full">
        <Card className="w-full md:w-5/13 max-w-2xl p-8 md:p-10 rounded-3xl shadow-2xl border border-primary/10 bg-card/90 backdrop-blur-lg mt-12">
          <div className="mb-6 text-center">
            <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-primary to-primary/80 bg-clip-text-transparent mb-1 tracking-tight">
            Sign IN
            </h1>
            <p className="text-base text-muted-foreground font-medium">
                Welcome Back,Please Signin to Continue To DashBoard

            </p>
          </div>
        </Card>
      </Container>
    </div>
  );
}
