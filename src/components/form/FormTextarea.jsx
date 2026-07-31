export default function FormTextarea({
  label,name,value,onChange,placeholder,rows=5,maxLength,resize=true,required=false,
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-medium text-zinc-300">{label}</label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        maxLength={maxLength}
        placeholder={placeholder}
        required={required}
        className={`w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 ${resize ? "resize-y":"resize-none"}`}
      />
      {maxLength && <p className="mt-2 text-right text-xs text-zinc-600">{value.length}/{maxLength}</p>}
    </div>
  );
}
