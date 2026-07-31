import Card from "../ui/Card";

export default function FormSection({ title, description, children, className = "" }) {
  return (
    <Card className={`p-6 ${className}`}>
      <div>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        {description && <p className="mt-1 text-sm text-zinc-500">{description}</p>}
      </div>
      <div className="mt-5">{children}</div>
    </Card>
  );
}
