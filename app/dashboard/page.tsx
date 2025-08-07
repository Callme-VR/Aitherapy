"use client";

import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Page() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background p-8">
      <Container className="pt-20 pb-9 space-y-6">
        <div className="flex flex-col gap-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col gap-3"
          >
            <h1 className="text-3xl font-bold">Welcome Back !</h1>
            <p className="text-muted-foreground text-sm">
              {currentTime.toLocaleTimeString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
              })}
            </p>
          </motion.div>
        </div>
        {/* main Grid Layout */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            <Card className="border-primary/10 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-transparent">
              
              </div>
            </Card>
          </div>
        </div> 
      </Container>
    </div>
  );
}
