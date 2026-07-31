export default function MediaPreview({ item }) {
  if (!item) {
    return null;
  }

  return (
    <div className="flex min-h-[420px] items-center justify-center bg-zinc-950/70 p-6">
      <img
        src={item.publicUrl}
        alt={item.altText || item.name}
        className="max-h-[68vh] max-w-full rounded-xl object-contain shadow-2xl shadow-black/30"
      />
    </div>
  );
}