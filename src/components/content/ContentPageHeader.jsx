export default function ContentPageHeader({
  eyebrow = "Gerenciamento de conteúdo",
  title,
  description,
  action,
}) {
  return (
    <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        {eyebrow && (
          <p className="text-sm font-medium text-blue-400">{eyebrow}</p>
        )}

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
          {title}
        </h1>

        {description && (
          <p className="mt-2 text-zinc-400">{description}</p>
        )}
      </div>

      {action}
    </section>
  );
}
