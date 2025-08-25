"use client";

import { AnxietyGames } from "@/components/games/anxiety-game";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { useSession } from "@/lib/contexts/session-context";
import { logActivity } from "@/lib/api/activity";
import { useToast } from "@/components/ui/use-toast";
import {
  getAllChatSessions,
  ChatSession,
  createChatSession,
} from "@/lib/api/chat";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  PlusCircle,
  Loader2,
  Smile,
  Meh,
  Frown,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Page() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { user } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const gamesCardRef = useRef<HTMLDivElement>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadSessions = async () => {
      if (!user) return;
      try {
        setIsLoading(true);
        const allSessions = await getAllChatSessions();
        setSessions(allSessions);
      } catch (error) {
        console.error("Failed to load sessions:", error);
        toast({
          title: "Error",
          description: "Failed to load chat sessions.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSessions();
  }, [user, toast]);

  const handleGamePlayed = async (gameName: string, description: string) => {
    if (!user) return;

    try {
      await logActivity({
        type: "game_played",
        name: gameName,
        description: description,
      });
      toast({
        title: "Activity Logged",
        description: `You played ${gameName}`,
      });
    } catch (error) {
      console.error("Failed to log game activity:", error);
      toast({
        title: "Error",
        description: "Failed to log your activity. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleNewSession = async () => {
    setIsCreatingSession(true);
    try {
      const newSessionId = await createChatSession();
      router.push(`/therapy/${newSessionId}`);
    } catch (error) {
      console.error("Failed to create new session:", error);
      toast({
        title: "Error",
        description: "Could not start a new chat session.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingSession(false);
    }
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    logActivity({ type: "mood_log", name: mood, description: `User logged mood: ${mood}` });
    toast({
      title: "Thank you for sharing!",
      description: `We've noted that you're feeling ${mood.toLowerCase()}`,
    });
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <Container className="pt-20 pb-9 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold">
            {getGreeting()}, {user?.name || "there"}!
          </h1>
          <p className="text-muted-foreground">
            {currentTime.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </motion.div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left/Main column */}
          <div className="lg:col-span-2 space-y-8" ref={gamesCardRef}>
            <Card className="border-primary/10 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-transparent"></div>
              <CardHeader>
                <CardTitle>Mindful Games</CardTitle>
                <CardDescription>
                  Engage in activities designed to reduce stress and anxiety.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AnxietyGames onGamePlayed={handleGamePlayed} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Session Summary</CardTitle>
                <CardDescription>An overview of your activity.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Total Sessions</p>
                  <p className="text-2xl font-bold">{sessions.length}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Last Session</p>
                  <p className="text-2xl font-bold">
                    {sessions.length > 0
                      ? new Date(sessions[0].updatedAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Start an activity with one click.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-auto py-4"
                  onClick={handleNewSession}
                  disabled={isCreatingSession}
                >
                  <div className="flex flex-col items-start w-full">
                    <p className="font-semibold">Start New Chat</p>
                    <p className="text-sm text-muted-foreground">
                      Talk with your AI therapist.
                    </p>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4"
                  onClick={() =>
                    gamesCardRef.current?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  <div className="flex flex-col items-start w-full">
                    <p className="font-semibold">Explore Mindful Games</p>
                    <p className="text-sm text-muted-foreground">
                      Find a calming activity.
                    </p>
                  </div>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>How are you feeling?</CardTitle>
                <CardDescription>Log your mood for the day.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Button
                  variant={selectedMood === "Great" ? "default" : "outline"}
                  className="h-auto py-4 flex flex-col gap-2"
                  onClick={() => handleMoodSelect("Great")}
                >
                  <Smile
                    className={cn(
                      "w-8 h-8",
                      selectedMood === "Great" && "text-white"
                    )}
                  />
                  <p>Great</p>
                </Button>
                <Button
                  variant={selectedMood === "Okay" ? "default" : "outline"}
                  className="h-auto py-4 flex flex-col gap-2"
                  onClick={() => handleMoodSelect("Okay")}
                >
                  <Meh
                    className={cn(
                      "w-8 h-8",
                      selectedMood === "Okay" && "text-white"
                    )}
                  />
                  <p>Okay</p>
                </Button>
                <Button
                  variant={
                    selectedMood === "Stressed" ? "destructive" : "outline"
                  }
                  className="h-auto py-4 flex flex-col gap-2"
                  onClick={() => handleMoodSelect("Stressed")}
                >
                  <Frown
                    className={cn(
                      "w-8 h-8",
                      selectedMood === "Stressed" && "text-white"
                    )}
                  />
                  <p>Stressed</p>
                </Button>
              </CardContent>
            </Card>
            {/* Add more cards for other features here */}
          </div>

          {/* Right column for Chat Sessions */}
          <div className="space-y-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Chat Sessions</CardTitle>
                  <CardDescription>Your recent conversations.</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleNewSession}
                  disabled={isCreatingSession}
                >
                  {isCreatingSession ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <PlusCircle className="w-5 h-5" />
                  )}
                </Button>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center h-40">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                  </div>
                ) : sessions.length > 0 ? (
                  <ScrollArea className="h-96">
                    <div className="space-y-4">
                      {sessions.map((session) => (
                        <Link
                          href={`/therapy/${session.sessionId}`}
                          key={session.sessionId}
                          className="block"
                        >
                          <div
                            className={cn(
                              "p-3 rounded-lg text-sm cursor-pointer hover:bg-muted/50 transition-colors border"
                            )}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <MessageSquare className="w-4 h-4" />
                              <span className="font-medium truncate">
                                {session.messages[0]?.content || "New Chat"}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground truncate">
                              {session.messages[session.messages.length - 1]
                                ?.content || "No messages yet"}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-muted-foreground">
                                {session.messages.length} messages
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(
                                  new Date(session.updatedAt),
                                  {
                                    addSuffix: true,
                                  }
                                )}
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground mb-4">
                      You have no chat sessions.
                    </p>
                    <Button
                      onClick={handleNewSession}
                      disabled={isCreatingSession}
                    >
                      {isCreatingSession ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <PlusCircle className="w-4 h-4 mr-2" />
                      )}
                      Start a New Session
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}


