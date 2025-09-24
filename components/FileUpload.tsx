import React, { useState, useRef, DragEvent } from 'react';

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
  disabled: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileChange, disabled }) => {
  const [fileName, setFileName] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File | undefined | null) => {
    if (file && (file.type.startsWith('audio/') || file.type.startsWith('video/'))) {
      setFileName(file.name);
      onFileChange(file);
    } else {
      setFileName('');
      onFileChange(null);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    processFile(event.target.files?.[0]);
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    const file = event.dataTransfer.files?.[0];
    processFile(file);
    // Clear the input field in case the user drops a file after selecting one
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const dragDropClasses = isDragging
    ? 'border-solid border-cyan-400 bg-slate-700/50 scale-105'
    : 'border-dashed border-slate-600';

  const hoverClasses = disabled
    ? 'opacity-50 cursor-not-allowed'
    : 'hover:border-cyan-400 hover:bg-slate-700/50';

  return (
    <div
      className={`border-2 rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${dragDropClasses} ${hoverClasses}`}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      aria-disabled={disabled}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label="Área para subir archivos de audio o video"
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="audio/*,video/*"
        className="hidden"
        disabled={disabled}
      />
      <div className="flex flex-col items-center pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-12 w-12 text-slate-500 mb-4 transition-transform duration-300 ${isDragging ? 'scale-110 text-cyan-400' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <p className="text-slate-400">
          <span className="font-semibold text-cyan-400">Haz clic para subir un archivo</span> o arrástralo aquí
        </p>
        <p className="text-xs text-slate-500 mt-1">MP3, WAV, MP4, MOV, etc. (Máx. 3MB)</p>
        {fileName && (
          <p className="mt-4 text-sm font-medium text-slate-300 bg-slate-700 px-3 py-1 rounded-full">
            {fileName}
          </p>
        )}
      </div>
    </div>
  );
};

export default FileUpload;