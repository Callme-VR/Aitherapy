"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  TreePine,
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

const MEDITATION_DURATION = 5 * 60; // 5 minutes

const CompletionScreen = ({ onReset }: { onReset: () => void }) => (
  <div className="flex flex-col items-center justify-center h-[400px] space-y-6">
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center"
    >
      <Check className="w-10 h-10 text-green-500" />
    </motion.div>
    <h3 className="text-2xl font-semibold">Mindful Moment Complete</h3>
    <p className="text-muted-foreground text-center max-w-sm">
      You've completed your mindful forest session. We hope you feel refreshed.
    </p>
    <Button onClick={onReset} className="mt-4 gap-2">
      <RotateCcw className="w-4 h-4" />
      Start Again
    </Button>
  </div>
);

export function ForestGame() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [timeLeft, setTimeLeft] = useState(MEDITATION_DURATION);
  const [isComplete, setIsComplete] = useState(false);

  const audioRef = useRef<{
    [key: string]: HTMLAudioElement;
  }>({});

  useEffect(() => {
    audioRef.current = {
      birds: new Audio("/sounds/birds.mp3"),
      wind: new Audio("/sounds/wind.mp3"),
      leaves: new Audio("/sounds/leaves.mp3"),
    };
    Object.values(audioRef.current).forEach((audio) => {
      audio.loop = true;
    });

    return () => {
      Object.values(audioRef.current).forEach((audio) => audio.pause());
    };
  }, []);

  useEffect(() => {
    Object.values(audioRef.current).forEach((audio) => {
      audio.volume = volume / 100;
    });
  }, [volume]);

  useEffect(() => {
    if (!isPlaying || isComplete) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsPlaying(false);
          setIsComplete(true);
          Object.values(audioRef.current).forEach((audio) => audio.pause());
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
      Object.values(audioRef.current).forEach((audio) => audio.pause());
    } else {
      Object.values(audioRef.current).forEach((audio) => audio.play());
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsComplete(false);
    setTimeLeft(MEDITATION_DURATION);
    setIsPlaying(false);
    Object.values(audioRef.current).forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = ((MEDITATION_DURATION - timeLeft) / MEDITATION_DURATION) * 100;

  if (isComplete) {
    return <CompletionScreen onReset={handleReset} />;
  }

  return (
    <div className="flex flex-col items-center justify-center h-[400px] space-y-8">
      <div className="relative w-48 h-48">
        <motion.div
          animate={{
            scale: isPlaying ? [1, 1.05, 1] : 1,
            rotate: isPlaying ? [0, 1, -1, 0] : 0,
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-green-500/20 to-transparent rounded-full blur-xl" />
          <div className="absolute inset-0 flex items-center justify-center">
            <TreePine className="w-24 h-24 text-green-600" />
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
            {formatTime(MEDITATION_DURATION)}
          </span>
        </div>
      </div>
    </div>
  );
}
