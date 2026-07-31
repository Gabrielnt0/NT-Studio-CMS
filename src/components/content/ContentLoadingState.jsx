import Card from "../ui/Card";

export default function ContentLoadingState({
  message = "Carregando conteúdo...",
}) {
  return (
    <Card className="flex min-h-64 flex-col items-center justify-center p-8 text-center">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-zinc-700 border-t-blue-500" />

      <p className="mt-4 text-sm font-medium text-zinc-300">{message}</p>
    </Card>
  );
}
