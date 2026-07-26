const variants = {
  primary: "bg-blue-600 text-white hover:bg-blue-500",
  secondary:
    "border border-zinc-800 bg-zinc-900 text-zinc-200 hover:bg-zinc-800",
  danger:
    "border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20",
  ghost: "text-zinc-400 hover:bg-zinc-800 hover:text-white",
};

const sizes = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-2.5 text-sm",
  icon: "h-9 w-9",
};

function Button({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) {
  return (
    <button
      type={type}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant] ?? variants.primary,
        sizes[size] ?? sizes.md,
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;