import Trash2 from "lucide-react/dist/esm/icons/trash-2";
import Modal from "../feedback/Modal";
import Button from "../ui/Button";

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  isMutating = false,
  title = "Excluir item",
  itemLabel = "O item selecionado",
  confirmLabel = "Excluir",
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description="Esta ação não poderá ser desfeita."
      size="md"
    >
      <div className="p-6">
        <div className="flex items-start gap-4 rounded-xl border border-red-500/20 bg-red-500/5 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
            <Trash2 size={19} />
          </div>

          <div>
            <h3 className="font-medium text-zinc-100">Confirmar exclusão</h3>

            <p className="mt-1 text-sm leading-6 text-zinc-400">
              {itemLabel} será removido permanentemente.
            </p>
          </div>
        </div>
      </div>

      <footer className="flex flex-col-reverse gap-3 border-t border-zinc-800 px-6 py-5 sm:flex-row sm:justify-end">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancelar
        </Button>

        <Button
          type="button"
          variant="danger"
          disabled={isMutating}
          onClick={onConfirm}
        >
          <Trash2 size={17} />
          {isMutating ? "Excluindo..." : confirmLabel}
        </Button>
      </footer>
    </Modal>
  );
}
