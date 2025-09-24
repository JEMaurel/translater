
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center w-full max-w-4xl mx-auto">
      <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
        Traductor de Audio con IA
      </h1>
      <p className="mt-3 text-lg text-slate-400">
        Sube un archivo de audio en cualquier idioma y obtén la transcripción y traducción al español.
      </p>
    </header>
  );
};

export default Header;
