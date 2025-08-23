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

      const goals: string[] = [];
      const systemPrompt = event.data;

      Logger.info("Processing chat message:", {
        message,
        historyLength: history?.length,
      });

      const analysis = await step.run("analyze-message", async () => {
        try {
          const prompt = `Analyze this therapy message and provide insights. Return ONLY a valid JSON object with no markdown formatting or additional text.
message: ${message}
context: ${JSON.stringify(memory)}
required JSON structure:
{
  "emotionalState": [],
  "riskLevel": 0,
  "themes": ["string"],
  "recomendedApproach": "string",
  "progressIndicators": ["string"]
}`;

          const result = await genai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
          });

          const text = result.text;
          if (!text)
            throw new Error("No response text received from Gemini API");

          Logger.info("Received analysis from Gemini:", { text });

          const cleanText = text.replace(/```json/g, "").replace(/```/g, "");
          return JSON.parse(cleanText);
        } catch (error) {
          Logger.error("Error in analyze-message:", { error, message });
          return {
            emotionalState: [],
            riskLevel: 0,
            themes: [],
            recomendedApproach: "",
            progressIndicators: [],
          };
        }
      });

      const updatedMemory = await step.run("update-memory", async () => {
        if (analysis.emotionalState) {
          memory.userProfile.emotionalState.push(...analysis.emotionalState);
        }
        if (analysis.themes) {
          memory.sessionHistory.push({ themes: analysis.themes });
        }
        if (analysis.riskLevel) {
          memory.userProfile.riskLevel = analysis.riskLevel;
        }

        if (analysis.riskLevel > 4) {
          await step.run("trigger-alert", async () => {
            Logger.warn("High risk level detected in chat messages", {
              message,
              riskLevel: analysis.riskLevel,
            });
          });
        }

        return memory;
      });

      const response = await step.run("generate-response", async () => {
        try {
          const result = await genai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `System prompt: ${JSON.stringify(systemPrompt)}

Based on the following context, generate a therapeutic response:
Message: ${message}
Analysis: ${JSON.stringify(analysis)}
Memory: ${JSON.stringify(memory)}
Goals: ${JSON.stringify(goals)}

Provide a response that:
1. Addresses the immediate emotional needs
2. Uses appropriate therapeutic techniques
3. Shows empathy and understanding
4. Maintains professional boundaries
5. Considers safety and well-being`,
          });

          return (
            result.text?.trim() ||
            "I'm here to support you. Could you tell me more about what's on your mind?"
          );
        } catch (error) {
          Logger.error("Error generating response:", { error, message });
          return "I'm here to support you. Could you tell me more about what's on your mind?";
        }
      });

      return {
        response,
        analysis,
        updatedMemory,
      };
    } catch (error) {
      Logger.error("Error in chat message processing:", {
        error,
        message: event.data.message,
      });
      return {
        response:
          "I'm here to support you. Could you tell me more about what's on your mind?",
        analysis: {
          emotionalState: [],
          themes: [],
          riskLevel: 0,
          recomendedApproach: "supportive",
          progressIndicators: [],
        },
        updatedMemory: event.data.memory,
      };
    }
  }
);

export const analyzeTherapySession = inngest.createFunction(
  { id: "analyze-therapy-session" },
  { event: "therapy/session.created" },
  async ({ event, step }) => {
    try {
      const sessionContent = await step.run("get-session-content", async () => {
        return event.data.notes || event.data.transcript || "";
      });

      const analysis = await step.run("analyze-session", async () => {
        try {
          const prompt = `Analyze this therapy session and provide insights:
Session Content: ${sessionContent}

Provide JSON with:
1. key themes and tools discussed
2. Emotional state analysis
3. Recommended next steps
4. Recommendations for follow-up
5. Progress indicators`;

          const result = await genai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
          });

          const text = result.text;
          if (!text) throw new Error("No response text from Gemini API");

          const cleanText = text.replace(/```json/g, "").replace(/```/g, "");
          return JSON.parse(cleanText);
        } catch (error) {
          Logger.error("Error analyzing session:", error);
          return {};
        }
      });

      await step.run("store-analysis", async () => {
        Logger.info("Session stored successfully");
        return analysis;
      });

      if (analysis.areaOfConcern?.length > 0) {
        await step.run("send-alert", async () => {
          Logger.warn("Concerning analysis detected in session analysis", {
            sessionId: event.data.sessionId,
            concerns: analysis.areaOfConcern,
          });
        });
      }

      return {
        message: "Session analysis completed",
        analysis,
      };
    } catch (error) {
      Logger.error("Error in therapy session analysis:", error);
      throw error;
    }
  }
);

export const generateActivityRecommendations = inngest.createFunction(
  { id: "generate-activity-recommendations" },
  { event: "mood/created" },
  async ({ event, step }) => {}
);
export const functions = [processChatMessage, analyzeTherapySession];
