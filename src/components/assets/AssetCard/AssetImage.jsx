export default function AssetImage({
  src,
  alt = "",
  loading = "lazy",
  fit = "cover",
  className = "",
}) {
  if (!src) {
    return (
      <div
        className={`flex h-full w-full items-center justify-center bg-zinc-950 text-sm text-zinc-600 ${className}`}
      >
        Imagem indisponível
      </div>
    );
  }

  const objectFitClass =
    fit === "contain" ? "object-contain" : "object-cover";

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      className={`h-full w-full transition duration-500 group-hover:scale-105 ${objectFitClass} ${className}`}
    />
  );
}
