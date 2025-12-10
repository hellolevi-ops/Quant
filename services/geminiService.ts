import { GoogleGenAI, Type } from "@google/genai";
import { ChatMessage } from "../types";

// Initialize client securely with safe process.env access
const apiKey = (typeof process !== 'undefined' && process.env && process.env.API_KEY) || '';

const ai = new GoogleGenAI({ apiKey });

export const generateStrategy = async (
  prompt: string, 
  history: ChatMessage[]
): Promise<{ text: string; code?: string; steps?: string[] }> => {
  
  const modelId = 'gemini-2.5-flash';
  
  const systemInstruction = `
    You are a senior Quant AI Engineer for a professional trading platform. 
    Your goal is to help users write Python strategies (Backtrader syntax) based on natural language descriptions.
    
    Response Format:
    1. Provide a brief "Chain of Thought" analysis in steps (e.g., Data Selection, Signal Logic, Risk Control).
    2. Provide the complete, runnable Python code using Backtrader.
    3. Provide a brief explanation of the strategy.
    
    If the user asks for analysis of an image, assume it is a candlestick chart and analyze the trend.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: [
        ...history.map(m => ({ role: m.role, parts: [{ text: m.content }] })),
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            steps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Logical steps taken to design the strategy"
            },
            explanation: { type: Type.STRING, description: "Short explanation for the user" },
            code: { type: Type.STRING, description: "Python Backtrader code" }
          },
          required: ["steps", "explanation", "code"]
        }
      }
    });

    const jsonText = response.text || "{}";
    const result = JSON.parse(jsonText);

    return {
      text: result.explanation,
      code: result.code,
      steps: result.steps
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      text: "Connection to Quantum Core failed. Please verify API Key or network status.",
      code: "# Error generating code",
      steps: ["Error"]
    };
  }
};