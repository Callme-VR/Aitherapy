"use client";

import { Ripple } from "@/components/magicui/ripple";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";
import { ArrowRight, Waves } from "lucide-react";
import { useEffect, useState } from "react";

export default function HomePage() {
  const emotions = [
    { value: 0, label: "😔 Down", color: "from-blue-500/60" },
    { value: 25, label: "😊 Content", color: "from-green-500/60" },
    { value: 50, label: "😌 Peaceful", color: "from-purple-500/60" },
    { value: 75, label: "🤗 Happy", color: "from-yellow-500/60" },
    { value: 100, label: "✨ Excited", color: "from-pink-500/60" },
  ];

  const [emotion, setEmotion] = useState(50);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentEmotion = emotions.reduce((prev, curr) =>
    Math.abs(curr.value - emotion) < Math.abs(prev.value - emotion)
      ? curr
      : prev
  );

  return (
    <div className="flex flex-col min-h-screen overflow-hidden bg-background text-foreground">
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        {/* Background gradients */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div
            className={`absolute w-[500px] h-[500px] rounded-full blur-3xl top-0 -left-20 transition-all duration-700 ease-in-out bg-gradient-to-r ${currentEmotion?.color} to-transparent opacity-60`}
          />
          <div className="absolute w-[400px] h-[400px] rounded-full bg-secondary/10 blur-3xl bottom-0 right-0 animate-pulse delay-700" />
          <div className="absolute inset-0 bg-background/80 backdrop-blur-3xl" />
        </div>

        <Ripple className="opacity-80" />

        {/* Main content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative space-y-10 text-center"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm border border-primary/30 bg-primary/10 backdrop-blur-sm hover:border-primary/50 transition-all duration-300">
            <Waves className="w-4 h-4 animate-wave text-primary" />
            <span className="relative text-foreground/90 dark:text-foreground after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-primary/40 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300">
              Your AI Agent Mental Health Companion
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-plus-jakarta tracking-tight leading-tight">
            <span className="inline-block bg-gradient-to-r from-primary via-primary/90 to-secondary bg-clip-text text-transparent hover:to-primary transition-all duration-300">
              Find Peace
            </span>
            <br />
            <span className="inline-block mt-2 bg-gradient-to-b from-foreground to-foreground/80 bg-clip-text text-transparent">
              of Mind
            </span>
          </h1>

          {/* Description */}
          <p className="max-w-[600px] mx-auto text-base md:text-lg text-muted-foreground leading-relaxed tracking-wide">
            Experience a new way of emotional support. Our AI companion is here
            to listen, understand, and guide you through life&apos;s journey.
          </p>

          {/* Emotion selector */}
          <motion.div
            className="w-full max-w-[600px] mx-auto space-y-8 py-8"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
            transition={{ delay: 0.2, duration: 0.9 }}
          >
            <div className="space-y-3 text-center">
              <p className="text-sm font-medium text-foreground/80">
                Whatever you&apos;re Feeling, We&apos;re Here For You
              </p>
              <div className="flex justify-between items-center px-2 sm:px-4">
                {emotions.map((em) => (
                  <div
                    key={em.value}
                    className={`transition-all duration-500 ease-out cursor-pointer hover:scale-105 ${
                      Math.abs(emotion - em.value) < 15
                        ? "opacity-100 scale-110"
                        : "opacity-50"
                    }`}
                    onClick={() => setEmotion(em.value)}
                  >
                    <div className="text-2xl">{em.label.split(" ")[0]}</div>
                    <div className="text-xs text-muted-foreground mt-1 font-medium">
                      {em.label.split(" ")[1]}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Slider */}
            <div className="relative px-2 sm:px-4">
              <div
                className={`absolute inset-0 bg-gradient-to-r ${currentEmotion.color} to-transparent blur-2xl -z-10 transition-all duration-700`}
              />
              <Slider
                className="py-4"
                max={100}
                min={0}
                value={[emotion]}
                onValueChange={(value) => setEmotion(value[0])}
              />
            </div>

            <div className="text-center">
              <p className="text-sm lg:text-lg text-muted-foreground animate-pulse">
                Slider for Your Expression
              </p>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
            transition={{ delay: 0.2, duration: 0.9 }}
          >
            <Button className="relative group h-12 px-8 rounded-full bg-gradient-to-r from-primary via-primary/90 to-secondary hover:to-primary shadow-primary/20 transition-all duration-500 hover:shadow-xl hover:shadow-primary/35">
              <span className="relative z-10 font-medium flex items-center gap-2">
                Begin Journey
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-400" />
              </span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Button>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
