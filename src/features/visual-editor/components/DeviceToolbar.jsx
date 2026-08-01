import { Laptop, Monitor, Smartphone, Tablet } from "lucide-react";

const devices = [
  { id: "desktop", label: "Desktop", icon: Monitor },
  { id: "laptop", label: "Laptop", icon: Laptop },
  { id: "tablet", label: "Tablet", icon: Tablet },
  { id: "mobile", label: "Celular", icon: Smartphone },
];

export default function DeviceToolbar({ device, onChange }) {
  return (
    <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-950 p-1">
      {devices.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={[
            "flex items-center gap-2 rounded-md px-2.5 py-2 text-xs font-medium transition",
            device === id
              ? "bg-blue-600 text-white"
              : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200",
          ].join(" ")}
          title={label}
          aria-label={label}
        >
          <Icon size={15} />
          <span className="hidden 2xl:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}
