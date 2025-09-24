export interface ProcessAudioResponse {
  transcription: string;
  translation: string;
}

export const processAudio = async (base64Audio: string, mimeType: string): Promise<ProcessAudioResponse> => {
  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ base64Audio, mimeType }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error en el servidor al procesar el audio.');
    }

    const data: ProcessAudioResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error processing audio:", error);
    if (error instanceof Error) {
      throw new Error(`No se pudo comunicar con el servidor de traducción: ${error.message}`);
    }
    throw new Error("No se pudo comunicar con el servidor de traducción.");
  }
};
