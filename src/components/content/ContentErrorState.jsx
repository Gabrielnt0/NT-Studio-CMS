import CircleAlert from "lucide-react/dist/esm/icons/circle-alert";
import Button from "../ui/Button";
import Card from "../ui/Card";

export default function ContentErrorState({
  title = "Não foi possível carregar o conteúdo",
  description = "Verifique sua conexão e tente novamente.",
  onRetry,
}) {
  return (
    <Card className="flex min-h-64 flex-col items-center justify-center p-8 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
        <CircleAlert size={24} />
      </div>

      <h3 className="mt-4 font-semibold text-white">{title}</h3>

      <p className="mt-2 max-w-md text-sm text-zinc-500">{description}</p>

      {onRetry && (
        <Button
          type="button"
          variant="secondary"
          onClick={onRetry}
          className="mt-5"
        >
          Tentar novamente
        </Button>
      )}
    </Card>
  );
}
