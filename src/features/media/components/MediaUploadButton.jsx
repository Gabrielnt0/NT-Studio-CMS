import { Upload } from "lucide-react";

export default function MediaUploadButton({
  onSelect,
  disabled = false,
}) {
  function handleChange(event) {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) return;

    onSelect(files);
    event.target.value = "";
  }

  return (
    <>
      <input
        id="media-upload-input"
        type="file"
        multiple
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={handleChange}
        disabled={disabled}
      />

      <label
        htmlFor="media-upload-input"
        className={[
          "inline-flex items-center justify-center gap-2 rounded-xl",
          "bg-blue-600 px-4 py-2.5 text-sm font-medium text-white",
          "transition hover:bg-blue-500",
          disabled
            ? "pointer-events-none cursor-not-allowed opacity-50"
            : "cursor-pointer",
        ].join(" ")}
      >
        <Upload size={18} />
        {disabled ? "Enviando..." : "Upload"}
      </label>
    </>
  );
}