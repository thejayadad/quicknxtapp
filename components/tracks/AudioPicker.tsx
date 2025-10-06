// components/tracks/AudioPicker.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { UploadCloud, Trash2 } from "lucide-react";

type Props = {
  file: File | null;
  onFileChange: (file: File | null) => void;
  label?: string;
  required?: boolean;
  name?: string;            // NEW
};

export default function AudioPicker({ file, onFileChange, label = "Audio file", required, name = "audioFile" }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!file) { setPreview(null); return; }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const next = e.target.files?.[0] ?? null;
    onFileChange(next);
  }

  function onRemove() {
    onFileChange(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-3">
      <div className="mb-2 text-sm font-medium text-neutral-800">{label}</div>
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex cursor-pointer items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm text-neutral-800 hover:bg-neutral-50">
          <UploadCloud className="h-4 w-4" />
          <span>{file ? "Replace audio" : "Choose audio"}</span>
          <input
            ref={inputRef}
            type="file"
            accept="audio/*"
            onChange={onPick}
            className="hidden"
            name={name}                 // ✅ ensures FormData includes file
            {...(required ? { required: true } : {})}
          />
        </label>

        {preview ? (
          <>
            <audio src={preview} controls className="h-8" />
            <button
              type="button"
              onClick={onRemove}
              className="inline-flex items-center gap-1 rounded-md border border-neutral-200 bg-white px-2 py-1 text-xs hover:bg-neutral-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Remove
            </button>
          </>
        ) : (
          <span className="text-xs text-neutral-500">No audio selected</span>
        )}
      </div>
    </div>
  );
}
