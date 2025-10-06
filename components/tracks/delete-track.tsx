// components/ui/DeleteTrackButton.tsx
import { deleteTrack } from "@/lib/actions/delete-track";

export function DeleteTrackButton({ id }: { id: string }) {
  return (
    <form action={deleteTrack} onSubmit={(e) => {
      if (!confirm("Delete this track?")) e.preventDefault();
    }}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="inline-flex items-center rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-700 hover:bg-red-100"
      >
        Delete
      </button>
    </form>
  );
}
