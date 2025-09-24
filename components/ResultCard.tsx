
import React from 'react';

interface ResultCardProps {
  title: string;
  text: string;
}

const ResultCard: React.FC<ResultCardProps> = ({ title, text }) => {
  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700 animate-fade-in">
      <h3 className="text-lg font-semibold text-cyan-400 mb-3">{title}</h3>
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
