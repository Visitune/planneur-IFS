'use client';

import { useCallback, useRef, useState } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';

interface Props {
  onFileLoaded: (buffer: ArrayBuffer, fileName: string) => void;
  loading: boolean;
}

export default function MandateUploader({ onFileLoaded, loading }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [status, setStatus] = useState<{ type: 'idle' | 'error' | 'success'; message: string }>({ type: 'idle', message: '' });

  const handleFile = useCallback((file: File) => {
    if (!file.name.match(/\.xlsx?$/i)) {
      setStatus({ type: 'error', message: 'Format invalide. Veuillez charger un fichier Excel (.xlsx)' });
      return;
    }
    setStatus({ type: 'idle', message: 'Chargement en cours...' });
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result instanceof ArrayBuffer) {
        setStatus({ type: 'success', message: `Fichier chargé: ${file.name}` });
        onFileLoaded(e.target.result, file.name);
      }
    };
    reader.onerror = () => {
      setStatus({ type: 'error', message: 'Erreur de lecture du fichier' });
    };
    reader.readAsArrayBuffer(file);
  }, [onFileLoaded]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => setDragOver(false), []);

  const handleClick = () => inputRef.current?.click();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold" style={{ color: 'var(--ink)' }}>
        1. Charger le mandat d&apos;audit
      </h2>
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
          dragOver ? 'scale-[1.02]' : ''
        }`}
        style={{
          borderColor: dragOver ? 'var(--accent)' : 'var(--accent-soft)',
          backgroundColor: dragOver ? 'var(--accent-soft)' : 'var(--paper)',
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleInputChange}
          className="hidden"
        />
        {loading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin w-10 h-10 border-4 rounded-full" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
            <p style={{ color: 'var(--muted)' }}>Analyse du fichier...</p>
          </div>
        ) : status.type === 'idle' ? (
          <div className="flex flex-col items-center gap-3">
            <Upload size={40} style={{ color: 'var(--accent)' }} />
            <p className="font-medium" style={{ color: 'var(--ink)' }}>Déposez le fichier Excel du mandat ici</p>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>ou cliquez pour parcourir (.xlsx)</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            {status.type === 'success' ? (
              <CheckCircle size={40} style={{ color: 'var(--sage)' }} />
            ) : (
              <AlertCircle size={40} style={{ color: 'var(--accent)' }} />
            )}
            <p style={{ color: status.type === 'success' ? 'var(--sage)' : 'var(--accent)' }}>
              {status.message}
            </p>
            <button
              onClick={(e) => { e.stopPropagation(); setStatus({ type: 'idle', message: '' }); }}
              className="text-sm underline"
              style={{ color: 'var(--accent)' }}
            >
              Changer de fichier
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
