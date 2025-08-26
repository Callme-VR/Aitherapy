"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Waves,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Check,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";

const BREATH_DURATION = 8; // seconds for one breath cycle
const SESSION_DURATION = 5 * 60; // 5 minutes in seconds

const CompletionScreen = ({ onReset }: { onReset: () => void }) => (
  <div className="flex flex-col items-center justify-center h-[400px] space-y-6">
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="w-20 h-20 rounded-full bg-blue-500/20 flex items-center justify-center"
    >
      <Check className="w-10 h-10 text-blue-500" />
    </motion.div>
    <h3 className="text-2xl font-semibold">Session Complete</h3>
    <p className="text-muted-foreground text-center max-w-sm">
      You completed the ocean waves session. We hope you feel calmer.
    </p>
    <Button onClick={onReset} className="mt-4 gap-2">
      <RotateCcw className="w-4 h-4" />
      Start Again
    </Button>
  </div>
);

export function OceanWaves() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [timeLeft, setTimeLeft] = useState(SESSION_DURATION);
  const [isComplete, setIsComplete] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("/sounds/waves.mp3");
    audioRef.current.loop = true;

    return () => {
      audioRef.current?.pause();
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    if (!isPlaying || isComplete) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsPlaying(false);
          setIsComplete(true);
          audioRef.current?.pause();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, isComplete]);

  const togglePlay = () => {
    if (isComplete) return;

    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsComplete(false);
    setTimeLeft(SESSION_DURATION);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = ((SESSION_DURATION - timeLeft) / SESSION_DURATION) * 100;

  if (isComplete) {
    return <CompletionScreen onReset={handleReset} />;
  }

  return (
    <div className="flex flex-col items-center justify-center h-[400px] space-y-8">
      <div className="relative w-48 h-48">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/20 to-transparent rounded-full blur-xl" />
        <motion.div
          animate={{
            y: isPlaying ? [0, -20, 0] : 0,
          }}
          transition={{
            duration: BREATH_DURATION,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="relative">
            <Waves className="w-24 h-24 text-blue-600" />
            <motion.div
              animate={{
                opacity: isPlaying ? [0.5, 0.8, 0.5] : 0.5,
              }}
              transition={{
                duration: BREATH_DURATION,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 bg-blue-400/10 blur-xl rounded-full"
            />
          </div>
        </motion.div>
      </div>

      <div className="w-64 space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Volume</span>
            <span>{volume}%</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setVolume(0)}>
              <VolumeX className="w-4 h-4" />
            </button>
            <Slider
              value={[volume]}
              onValueChange={(value) => setVolume(value[0])}
              max={100}
              step={1}
            />
            <button onClick={() => setVolume(100)}>
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <Progress value={progress} className="h-2" />

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {formatTime(timeLeft)}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={togglePlay}
            className="rounded-full"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          <span className="text-sm text-muted-foreground">
            {formatTime(SESSION_DURATION)}
          </span>
        </div>
      </div>
    </div>
  );
}