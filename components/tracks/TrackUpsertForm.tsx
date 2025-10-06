// components/tracks/TrackUpsertForm.tsx
"use client";

import { useActionState, useMemo, useState } from "react";
import { Loader2, Tag as TagIcon } from "lucide-react";
import ImagePicker from "./ImagePicker";
import AudioPicker from "./AudioPicker";
import KeyChips from "./KeyChips";
import { ActionResult, createTrackAction } from "@/lib/actions/create-track";

type Props = { onDone?: () => void };

export default function TrackUpsertForm({ onDone }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagsCsv, setTagsCsv] = useState("");
  const [keySig, setKeySig] = useState<string | null | undefined>(undefined);
  const [visibility, setVisibility] = useState<"PUBLIC"|"UNLISTED"|"PRIVATE">("PUBLIC");
  const [isFree, setIsFree] = useState(true);
  const [priceDollars, setPriceDollars] = useState<string>("");

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);

  const canSubmit = useMemo(() => {
    if (!title.trim()) return false;
    if (!audioFile) return false;
    if (!isFree && !priceDollars) return false;
    return true;
  }, [title, audioFile, isFree, priceDollars]);

  const [state, formAction, pending] =
    useActionState<ActionResult<{ id: string; title: string }> | null, FormData>(
      createTrackAction,
      null
    );

  // Close on success
  if (state?.ok) onDone?.();

  return (
    <form
      action={formAction}                 // ✅ submit goes through transition
      className="space-y-6"
    >
      {/* Title */}
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-800">Title</label>
        <input
          name="title"                     // ✅ server will read this
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-300"
          placeholder="Track title"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-800">Description</label>
        <textarea
          name="description"               // ✅
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full resize-none rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-300"
          placeholder="Tell listeners about your track…"
        />
      </div>

      {/* Media */}
      <div className="grid gap-4 sm:grid-cols-2">
        <ImagePicker file={coverFile} onFileChange={setCoverFile} name="coverFile" />
        <AudioPicker file={audioFile} onFileChange={setAudioFile} name="audioFile" required />
      </div>

      {/* Tags (CSV) */}
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-800">Tags (comma-separated)</label>
        <div className="rounded-md border border-neutral-200 bg-white px-2 py-1.5">
          <div className="flex items-center gap-2">
            <TagIcon className="h-4 w-4 text-neutral-500" />
            <input
              name="tagsCsv"               // ✅
              value={tagsCsv}
              onChange={(e) => setTagsCsv(e.target.value)}
              placeholder="lofi, chill, study"
              className="flex-1 bg-transparent px-2 py-1 text-sm outline-none placeholder:text-neutral-400"
              onKeyDown={(e) => {
                // prevent Enter from submitting while editing tags
                if (e.key === "Enter") e.preventDefault();
              }}
            />
          </div>
        </div>
      </div>

      {/* Hidden values for non-native controls */}
      <input type="hidden" name="visibility" value={visibility} />  {/* ✅ */}
      <input type="hidden" name="key" value={keySig ?? ""} />       {/* ✅ */}
      {/* Send "on" if free; server treats missing as false */}
      {isFree && <input type="hidden" name="isFree" value="on" />}  {/* ✅ */}
      {/* Always send price; server ignores if isFree */}
      <input type="hidden" name="priceDollars" value={priceDollars} />

      {/* Key / Visibility / Pricing UI */}
      <div className="grid gap-4">
        <KeyChips value={keySig} onChange={setKeySig} />

        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-800">Visibility</label>
          <div className="flex gap-2">
            {(["PUBLIC","UNLISTED","PRIVATE"] as const).map(v => (
              <button
                key={v}
                type="button"
                onClick={() => setVisibility(v)}
                className={`flex-1 rounded-md border px-3 py-2 text-sm ${
                  visibility === v
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50"
                }`}
              >
                {v.charAt(0) + v.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-800">Pricing</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsFree(true)}
              className={`flex-1 rounded-md border px-3 py-2 text-sm ${
                isFree ? "border-neutral-900 bg-neutral-900 text-white"
                       : "border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50"
              }`}
            >
              Free
            </button>
            <button
              type="button"
              onClick={() => setIsFree(false)}
              className={`flex-1 rounded-md border px-3 py-2 text-sm ${
                !isFree ? "border-neutral-900 bg-neutral-900 text-white"
                        : "border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50"
              }`}
            >
              Paid
            </button>
          </div>

          {!isFree && (
            <div className="mt-2">
              <label className="mb-1 block text-xs font-medium text-neutral-700">Price (USD)</label>
              <input
                inputMode="decimal"
                name="priceDollars"                // redundant with hidden above, but harmless
                placeholder="1.99"
                value={priceDollars}
                onChange={(e) => setPriceDollars(e.target.value)}
                className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-300"
              />
            </div>
          )}
        </div>
      </div>

      {/* Server error */}
      {!state?.ok && state?.error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </div>
      ) : null}

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onDone}
          className="inline-flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm text-neutral-900 hover:bg-neutral-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!canSubmit || pending}
          className="inline-flex items-center gap-2 rounded-md bg-neutral-900 px-3 py-1.5 text-sm text-white hover:bg-neutral-800 disabled:opacity-60"
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Create Track
        </button>
      </div>
    </form>
  );
}
