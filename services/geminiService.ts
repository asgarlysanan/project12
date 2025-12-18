import { GoogleGenAI, Type } from "@google/genai";
import { AIResponse, AIActionType, AppDefinition, FileDefinition } from "../types";

// Note: In a real production build, we would ensure process.env.API_KEY is present.
// For this demo, we assume the environment is correctly set up.

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const interpretCommand = async (
  userCommand: string,
  installedApps: AppDefinition[],
  availableFiles: FileDefinition[]
): Promise<AIResponse> => {
  if (!process.env.API_KEY) {
    return {
      action: AIActionType.GENERAL_CHAT,
      responseText: "API Key not detected. Please configure the environment.",
      confidence: 0
    };
  }

  const appNames = installedApps.map(app => app.name).join(', ');
  const fileNames = availableFiles.map(file => file.name).join(', ');

  const systemInstruction = `
    You are the 'Neural Windows OS' core. You control a Windows computer.
    User Context:
    - Installed Apps: ${appNames}
    - Recent Files: ${fileNames}
    
    Your goal is to interpret the user's voice or text command and decide on a SYSTEM ACTION.
    Be proactive, concise, and act like a highly advanced AI operating system.
    If the user asks to open an app, search a file, or check system status, map it to the correct ActionType.
    If the command is unclear or conversational, use GENERAL_CHAT.
    For 'target', provide the exact name of the app or file if applicable.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userCommand,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            action: {
              type: Type.STRING,
              enum: [
                AIActionType.OPEN_APP,
                AIActionType.CLOSE_APP,
                AIActionType.SEARCH_FILES,
                AIActionType.SYSTEM_DIAGNOSTIC,
                AIActionType.GENERAL_CHAT,
                AIActionType.OPTIMIZE_PERFORMANCE
              ]
            },
            target: {
              type: Type.STRING,
              description: "The specific app name or file name to act upon, if any."
            },
            responseText: {
              type: Type.STRING,
              description: "A short, robotic but polite confirmation message to the user (e.g., 'Opening Spotify now.')."
            },
            confidence: {
              type: Type.NUMBER,
              description: "Confidence level 0-1"
            },
            reasoning: {
                type: Type.STRING,
                description: "Why this action was chosen."
            }
          },
          required: ["action", "responseText", "confidence"]
        }
      }
    });

    if (response.text) {
        return JSON.parse(response.text) as AIResponse;
    }
    
    throw new Error("No response text");

  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      action: AIActionType.GENERAL_CHAT,
      responseText: "I encountered a neural processing error. Please repeat.",
      confidence: 0
    };
  }
};
