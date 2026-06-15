'use client';
// components/admin/ImageUpload.tsx
import { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  value: string[];              // URLs actuelles
  onChange: (urls: string[]) => void;
  folder?: string;              // sous-dossier dans le bucket (ex: 'products', 'blog')
  multiple?: boolean;
  maxFiles?: number;
}

export default function ImageUpload({
  value,
  onChange,
  folder = 'products',
  multiple = true,
  maxFiles = 5,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList) {
    if (!files.length) return;
    setError('');

    const remaining = maxFiles - value.length;
    const toUpload = Array.from(files).slice(0, remaining);

    if (toUpload.length === 0) {
      setError(`Maximum ${maxFiles} image(s) autorisée(s).`);
      return;
    }

    setUploading(true);
    try {
      const newUrls: string[] = [];
      for (const file of toUpload) {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('folder', folder);

        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          credentials: 'same-origin',
          body: fd,
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error ?? 'Erreur upload');
        newUrls.push(data.url);
      }
      onChange([...value, ...newUrls]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'upload');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  function removeImage(idx: number) {
    onChange(value.filter((_, i) => i !== idx));
  }

  return (
    <div className="space-y-3">
      {/* Zone de drop / bouton upload */}
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        className={`border-2 border-dashed rounded-brand p-6 text-center cursor-pointer transition-colors ${
          uploading
            ? 'border-brand-blue/40 bg-brand-blue-pale'
            : 'border-gray-200 hover:border-brand-blue/40 hover:bg-gray-50'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple={multiple}
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-2 text-brand-blue">
            <Loader2 size={24} className="animate-spin" />
            <span className="text-sm font-medium">Upload en cours…</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <Upload size={24} />
            <span className="text-sm">
              Cliquer pour ajouter {multiple ? 'des images' : 'une image'}
            </span>
            <span className="text-xs">JPG, PNG, WebP — max 5 Mo</span>
          </div>
        )}
      </div>

      {error && (
        <p className="text-red-600 text-xs">{error}</p>
      )}

      {/* Aperçu des images */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {value.map((url, idx) => (
            <div key={idx} className="relative w-24 h-24 rounded-brand overflow-hidden border border-gray-200 group">
              <Image src={url} alt={`Image ${idx + 1}`} fill className="object-cover" />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Supprimer"
              >
                <X size={12} />
              </button>
              {idx === 0 && (
                <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[9px] text-center py-0.5 font-bold">
                  Principale
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
