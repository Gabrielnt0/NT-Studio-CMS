export default function AssetOverlay({
  visible = true,
  children,
}) {
  if (!visible) return null;

  return (
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 opacity-0 transition duration-300 group-hover:opacity-100">
      {children}
    </div>
  );
}
