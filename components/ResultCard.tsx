import React from 'react';

interface ResultCardProps {
  title: string;
  text: string;
  onDownloadClick?: () => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ title, text, onDownloadClick }) => {
  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700 animate-fade-in">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-cyan-400">{title}</h3>
        {onDownloadClick && (
          <button
            onClick={onDownloadClick}
            className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 p-1"
            title="Descargar"
            aria-label="Descargar contenido"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
        )}
      </div>
      <div className="text-slate-300 whitespace-pre-wrap max-h-64 overflow-y-auto pr-2">
        {text}
      </div>
    </div>
  );
};

// Add a simple fade-in animation using a style tag - Tailwind config not available.
const style = document.createElement('style');
style.innerHTML = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}
`;
document.head.appendChild(style);


export default ResultCard;