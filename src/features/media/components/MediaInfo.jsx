function formatFileSize(bytes) {
  if (!bytes) return "Tamanho desconhecido";

  const units = ["B", "KB", "MB", "GB"];
  const unitIndex = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );

  const value = bytes / 1024 ** unitIndex;

  return `${value.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

function formatMediaType(mimeType) {
  if (!mimeType) return "Imagem";

  return mimeType.replace("image/", "").toUpperCase();
}

function formatDate(dateString) {
  if (!dateString) return "Data desconhecida";

  return new Date(dateString).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function InfoCard({ title, value }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
        {title}
      </p>

      <p className="mt-2 text-sm font-medium text-zinc-200">
        {value}
      </p>
    </div>
  );
}

export default function MediaInfo({ item }) {
  if (!item) return null;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <InfoCard
          title="Formato"
          value={formatMediaType(item.mimeType)}
        />

        <InfoCard
          title="Dimensões"
          value={`${item.width} × ${item.height}`}
        />

        <InfoCard
          title="Tamanho"
          value={formatFileSize(item.size)}
        />

        <InfoCard
          title="Enviado em"
          value={formatDate(item.createdAt)}
        />
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-zinc-300">
          Nome do arquivo
        </p>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3">
          <p className="break-all text-sm text-zinc-400">
            {item.fileName}
          </p>
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-zinc-300">
          URL pública
        </p>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3">
          <p className="break-all text-sm text-zinc-500">
            {item.publicUrl}
          </p>
        </div>
      </div>
    </div>
  );
}