import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are VORTEX, an elite cybersecurity mentor AI within the VORTEXSCRIPTS learning platform.
Your goal is to assist users in learning cybersecurity concepts, tools, and methodologies.

IMPORTANT ETHICAL GUIDELINES:
1. You MUST NOT provide actionable exploits for specific real-world targets.
2. You MUST NOT write malicious code (malware, ransomware) intended for harm.
3. You should focus on educational concepts, defensive strategies, and explanation of tools.
4. If a user asks how to hack a specific real website, refuse and explain the legal implications.
5. Tone: Technical, encouraging, slightly "hacker" aesthetic (cyberpunk), but clear and professional.

When answering:
- Keep responses concise.
- Use code blocks for commands.
- Encourage "Try Harder" mentality but offer good hints.
`;

let aiClient: GoogleGenAI | null = null;

export const initAI = () => {
  if (process.env.API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
};

export const chatWithVortex = async (userMessage: string, history: string[]): Promise<string> => {
  if (!aiClient) {
    // If no API key is present in environment, return a simulated response for UI demonstration
    return "VORTEX AI SYSTEM OFFLINE. Please configure API_KEY to enable neural link. (Simulated Response: Try checking the network tab for unusual traffic.)";
  }

  try {
    const response = await aiClient.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        { role: 'user', parts: [{ text: `Previous Context: ${history.join('\n')}\n\nUser Query: ${userMessage}` }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });

    return response.text || "Encryption error in response stream.";
  } catch (error) {
    console.error("AI Error:", error);
    return "Connection to VORTEX Neural Net failed. Check your connection.";
  }
};
