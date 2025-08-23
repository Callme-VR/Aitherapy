import Logger from "../utils/logger";
import { inngest } from "./index";
import { GoogleGenAI } from "@google/genai";

const genai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY as string,
});

export const processChatMessage = inngest.createFunction(
  { id: "process-chat-message" },
  { event: "therapy/session.message" },
  async ({ event, step }) => {
    try {
      const {
        message,
        history,
        memory = {
          userProfile: {
            emotionalState: [],
            riskLevel: 0,
            preferences: {},
          },
          sessionHistory: [],
          currentTechnique: null,
        },
      } = event.data;

      const goal: string[] = [];
      const systemPrompt = event.data;

      // Example: log the message
      Logger.info("Received message:", message);

      // TODO: integrate with Google GenAI here
      // const response = await genai.chat(/* your params */);

      return {
        success: true,
        message,
        history,
        memory,
        goal,
        systemPrompt,
      };
    } catch (error) {
      Logger.error("Error in processChatMessage:", error);
      return { success: false, error: (error as Error).message };
    }
  }
);
