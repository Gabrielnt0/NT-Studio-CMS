const variants = {
  blue: "bg-blue-500/10 text-blue-400",
  green: "bg-emerald-500/10 text-emerald-400",
  yellow: "bg-amber-500/10 text-amber-400",
  purple: "bg-violet-500/10 text-violet-400",
  zinc: "bg-zinc-800 text-zinc-300",
};

function Badge({ children, variant = "zinc" }) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        variants[variant] ?? variants.zinc,
      ].join(" ")}
    >
      {children}
    </span>
  );
}

export default Badge;