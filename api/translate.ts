// Vercel Serverless Function
// This function will be deployed at the `/api/translate` endpoint.

import { GoogleGenAI } from "@google/genai";

// A generic interface for the request body
interface ApiRequestBody {
  base64Audio: string;
  mimeType: string;
}

// A generic interface for the response, compatible with Vercel
interface ApiResponse {
  status: (code: number) => {
    json: (data: any) => void;
  };
}

// The handler needs to be the default export
export default async function handler(
  req: { method?: string; body: ApiRequestBody },
  res: ApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API_KEY environment variable not set on the server.' });
  }

  const { base64Audio, mimeType } = req.body;
  if (!base64Audio || !mimeType) {
    return res.status(400).json({ error: 'Missing base64Audio or mimeType in request body.' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const model = 'gemini-2.5-flash';

    // Step 1: Transcribe Audio
    const audioPart = {
      inlineData: { data: base64Audio, mimeType: mimeType },
    };
    const transcriptionPrompt = {
      text: "Transcribe el texto de este archivo de audio. Responde únicamente con el texto transcrito.",
    };
    const transcriptionResponse = await ai.models.generateContent({
      model: model,
      contents: { parts: [audioPart, transcriptionPrompt] },
    });
    const transcription = transcriptionResponse.text;

    if (!transcription || transcription.trim() === '') {
        // Handle cases where transcription might be empty
        return res.status(200).json({ 
            transcription: '(No se detectó texto en el audio)', 
            translation: '(No se pudo traducir ya que no se detectó texto)' 
        });
    }

    // Step 2: Translate Text
    const translationPrompt = `Traduce el siguiente texto a Español. Responde únicamente con la traducción, sin añadir explicaciones adicionales o texto introductorio.\n\nTexto a traducir:\n"${transcription}"`;
    const translationResponse = await ai.models.generateContent({
        model: model,
        contents: translationPrompt
    });
    const translation = translationResponse.text;

    return res.status(200).json({ transcription, translation });

  } catch (error) {
    console.error("Error in serverless function:", error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return res.status(500).json({ error: `Failed to process audio with Gemini API: ${errorMessage}` });
  }
}
