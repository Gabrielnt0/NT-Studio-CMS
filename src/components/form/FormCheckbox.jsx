export default function FormCheckbox({label,name,checked,onChange}) {
  return (
    <label className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-zinc-700 bg-zinc-950 text-blue-600 focus:ring-blue-500"
      />
      <span className="text-sm text-zinc-300">{label}</span>
    </label>
  );
}
