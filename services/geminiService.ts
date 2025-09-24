
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'gemini-2.5-flash';

export const transcribeAudio = async (base64Audio: string, mimeType: string): Promise<string> => {
  try {
    const audioPart = {
      inlineData: {
        data: base64Audio,
        mimeType: mimeType,
      },
    };

    const textPart = {
      text: "Transcribe el texto de este archivo de audio. Responde únicamente con el texto transcrito.",
    };

    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: [audioPart, textPart] },
    });
    
    return response.text;
  } catch (error) {
    console.error("Error during transcription:", error);
    throw new Error("Failed to transcribe audio.");
  }
};

export const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  try {
    const prompt = `Traduce el siguiente texto a ${targetLanguage}. Responde únicamente con la traducción, sin añadir explicaciones adicionales o texto introductorio.\n\nTexto a traducir:\n"${text}"`;
    
    const response = await ai.models.generateContent({
        model: model,
        contents: prompt
    });

    return response.text;
  } catch (error) {
    console.error("Error during translation:", error);
    throw new Error("Failed to translate text.");
  }
};
