"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wind, Check, Play, Pause, RotateCcw } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

const TOTAL_ROUNDS = 5;

const breathingCycle = {
  inhale: { duration: 4000, text: "Breathe In" },
  hold: { duration: 4000, text: "Hold" },
  exhale: { duration: 6000, text: "Breathe Out" },
};

const phases: ("inhale" | "hold" | "exhale")[] = ["inhale", "hold", "exhale"];

const CompletionScreen = ({ onReset }: { onReset: () => void }) => (
  <div className="flex flex-col items-center justify-center h-[400px] space-y-6">
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center"
    >
      <Check className="w-10 h-10 text-green-500" />
    </motion.div>
    <h3 className="text-2xl font-semibold">Great job!</h3>
    <p className="text-muted-foreground text-center max-w-sm">
      You've completed {TOTAL_ROUNDS} rounds of breathing exercises. How do you
      feel?
    </p>
    <Button onClick={onReset} className="mt-4 gap-2">
      <RotateCcw className="w-4 h-4" />
      Start Again
    </Button>
  </div>
);

export function BreathingGame() {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [round, setRound] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const currentPhase = phases[phaseIndex];
  const { duration, text } = breathingCycle[currentPhase];

  useEffect(() => {
    if (isPaused || isComplete) return;

    const timer = setTimeout(() => {
      if (currentPhase === "exhale") {
        if (round >= TOTAL_ROUNDS) {
          setIsComplete(true);
        } else {
          setRound((r) => r + 1);
          setPhaseIndex(0);
        }
      } else {
        setPhaseIndex((i) => i + 1);
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [phaseIndex, round, isPaused, isComplete, currentPhase, duration]);

  const handleReset = () => {
    setPhaseIndex(0);
    setRound(1);
    setIsComplete(false);
    setIsPaused(false);
  };

  if (isComplete) {
    return <CompletionScreen onReset={handleReset} />;
  }

  return (
    <div className="flex flex-col items-center justify-center h-[400px] space-y-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPhase}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <div className="relative w-32 h-32 mx-auto">
            <motion.div
              initial={{ scale: 1 }}
              animate={{
                scale: currentPhase === "inhale" ? 1.5 : currentPhase === "exhale" ? 1 : 1.5,
              }}
              transition={{ duration: duration / 1000, ease: "easeInOut" }}
              className="absolute inset-0 bg-primary/10 rounded-full"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Wind className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h3 className="text-2xl font-semibold">{text}</h3>
        </motion.div>
      </AnimatePresence>

      <div className="w-64">
        <motion.div
          key={`${currentPhase}-${round}`}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: duration / 1000, ease: "linear" }}
        >
          <Progress value={100} className="h-2" />
        </motion.div>
      </div>

      <div className="space-y-2 text-center">
        <div className="text-sm text-muted-foreground">
          Round {round} of {TOTAL_ROUNDS}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsPaused(!isPaused)}
          className="gap-2"
        >
          {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          {isPaused ? "Resume" : "Pause"}
        </Button>
      </div>
    </div>
  );
}