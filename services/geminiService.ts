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
      let errorMessage;
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.indexOf('application/json') !== -1) {
        const errorData = await response.json();
        errorMessage = errorData.error || 'Error en el servidor al procesar el audio.';
      } else {
        const errorText = await response.text();
        console.error("Server Error Text:", errorText);
        if (response.status === 413 || errorText.includes('Payload Too Large')) {
            errorMessage = 'El archivo enviado es demasiado grande para el servidor.';
        } else {
            errorMessage = `Error del servidor (${response.status}).`;
        }
      }
      throw new Error(errorMessage);
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