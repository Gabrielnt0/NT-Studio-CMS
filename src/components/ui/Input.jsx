function Input({ label, error, className = "", ...props }) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-zinc-300">
          {label}
        </label>
      )}

      <input
        className={[
          "w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10",
          error ? "border-red-500" : "",
          className,
        ].join(" ")}
        {...props}
      />

      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}

export default Input;