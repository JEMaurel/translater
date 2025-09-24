import React, { useState, useCallback } from 'react';
import { processAudio } from './services/geminiService';
import FileUpload from './components/FileUpload';
import ResultCard from './components/ResultCard';
import Loader from './components/Loader';
import Header from './components/Header';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [transcribedText, setTranscribedText] = useState<string>('');
  const [translatedText, setTranslatedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (file: File | null) => {
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
      setError(null);
      setTranscribedText('');
      setTranslatedText('');
    } else {
      setAudioFile(null);
      setError('Por favor, selecciona un archivo de audio válido (ej. MP3, WAV).');
    }
  };

  const handleTranslate = useCallback(async () => {
    if (!audioFile) {
      setError('No se ha seleccionado ningún archivo de audio.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setTranscribedText('');
    setTranslatedText('');
    setStatusMessage('Procesando audio... (esto puede tardar unos momentos)');

    try {
      const reader = new FileReader();
      reader.readAsDataURL(audioFile);
      reader.onloadend = async () => {
        try {
          const base64Audio = (reader.result as string).split(',')[1];
          const { transcription, translation } = await processAudio(base64Audio, audioFile.type);
          
          setTranscribedText(transcription);
          setTranslatedText(translation);
        } catch (apiError: any) {
          console.error('API Error:', apiError);
          setError(apiError.message || 'Ocurrió un error al procesar el audio. Por favor, inténtalo de nuevo.');
        } finally {
          setIsLoading(false);
          setStatusMessage('');
        }
      };
      reader.onerror = () => {
        setError('Error al leer el archivo de audio.');
        setIsLoading(false);
      };
    } catch (err) {
      console.error('File Reading Error:', err);
      setError('No se pudo leer el archivo. Inténtalo de nuevo.');
      setIsLoading(false);
    }
  }, [audioFile]);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center w-full max-w-4xl mx-auto py-12">
        <div className="relative w-full bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-slate-700">
          <a
            href="https://github.com/google-gemini"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-4 right-4 text-slate-500 hover:text-cyan-400 transition-colors duration-300"
            aria-label="Ver código fuente en GitHub"
            title="Ver código fuente en GitHub"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.168 6.839 9.492.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.378.203 2.398.1 2.651.64.7 1.03 1.595 1.03 2.688 0 3.848-2.338 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
            </svg>
          </a>
          
          <FileUpload onFileChange={handleFileChange} disabled={isLoading} />
          
          <div className="mt-8 text-center">
            <button
              onClick={handleTranslate}
              disabled={!audioFile || isLoading}
              className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-full shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none"
            >
              {isLoading ? 'Procesando...' : 'Traducir Audio'}
            </button>
          </div>

          {isLoading && <Loader message={statusMessage} />}
          
          {error && (
            <div className="mt-6 text-center text-red-400 bg-red-900/50 p-3 rounded-lg">
              <p>{error}</p>
            </div>
          )}

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {transcribedText && (
              <ResultCard title="Transcripción Original" text={transcribedText} />
            )}
            {translatedText && (
              <ResultCard title="Traducción al Español" text={translatedText} />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
