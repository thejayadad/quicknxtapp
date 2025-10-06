
"use client";

const KEYS = [
  "C","G","D","A","E","B","F#","C#","F","Bb","Eb","Ab","Db","Gb","Cb",
  "Am","Em","Bm","F#m","C#m","G#m","D#m","A#m","Dm","Gm","Cm","Fm","Bbm","Ebm","Abm",
];

export default function KeyChips({
  value,
  onChange,
}: {
  value: string | null | undefined;
  onChange: (v: string | null) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-neutral-800">Key</label>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange(null)}
          className={`rounded-md px-3 py-1.5 text-sm border ${
            !value ? "border-neutral-900 bg-neutral-900 text-white"
                   : "border-neutral-200 bg-white hover:bg-neutral-50"
          }`}
        >
          None
        </button>
        {KEYS.map(k => (
          <button
            key={k}
            type="button"
            onClick={() => onChange(k)}
            className={`rounded-md px-3 py-1.5 text-sm border ${
              value === k ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-neutral-200 bg-white hover:bg-neutral-50"
            }`}
          >
            {k}
          </button>
        ))}
      </div>
    </div>
  );
}
