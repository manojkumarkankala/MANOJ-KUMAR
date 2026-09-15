import { useState, useRef } from 'react';
import { Upload, X, Loader2, ImageIcon } from 'lucide-react';
import { uploadImage } from '@/lib/storage';

interface ImageUploadProps {
  value: string | null;
  onChange: (url: string) => void;
  folder: string;
  label?: string;
  className?: string;
}

export function ImageUpload({ value, onChange, folder, label = 'Image', className = '' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(value);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setUploading(true);
    setError(null);
    setPreview(URL.createObjectURL(file));

    const { url, error: uploadError } = await uploadImage(file, folder);
    if (uploadError) {
      setError(uploadError);
      setPreview(value);
    } else {
      onChange(url);
    }
    setUploading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className={className}>
      {label && <label className="block text-sm text-gray-400 mb-1.5">{label}</label>}

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="relative border-2 border-dashed border-white/10 rounded-xl overflow-hidden group"
      >
        {(preview || value) ? (
          <div className="relative">
            <img src={preview || value || ''} alt="Preview" className="w-full h-40 object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="px-3 py-1.5 bg-white/10 text-white text-sm rounded-lg backdrop-blur-md"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={() => {
                  setPreview(null);
                  onChange('');
                }}
                className="px-3 py-1.5 bg-red-500/20 text-red-300 text-sm rounded-lg backdrop-blur-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="w-full h-40 flex flex-col items-center justify-center text-gray-500 hover:text-gray-300 transition-colors"
          >
            {uploading ? <Loader2 className="w-8 h-8 animate-spin" /> : <ImageIcon className="w-8 h-8 mb-2" />}
            <span className="text-sm">{uploading ? 'Uploading...' : 'Click or drag to upload'}</span>
            <span className="text-xs text-gray-600 mt-1">JPG, PNG, WEBP (max 5MB)</span>
          </button>
        )}

        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>

      {error && <p className="text-red-400 text-xs mt-1.5">{error}</p>}
    </div>
  );
}
