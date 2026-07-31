const variants = {
  default: "bg-zinc-800 text-zinc-300",
  success: "bg-emerald-500/15 text-emerald-400",
  warning: "bg-amber-500/15 text-amber-400",
  danger: "bg-red-500/15 text-red-400",
  info: "bg-blue-500/15 text-blue-400",
  purple: "bg-purple-500/15 text-purple-400",
};

export default function StatusBadge({
  children,
  variant = "default",
  className = "",
}) {
  const variantClass = variants[variant] ?? variants.default;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${variantClass} ${className}`}
    >
      {children}
    </span>
  );
}
