import Save from "lucide-react/dist/esm/icons/save";
import Button from "../ui/Button";

export default function FormActions({
  isLoading=false,
  label="Salvar alterações",
  loadingLabel="Salvando...",
}) {
  return (
    <Button type="submit" disabled={isLoading}>
      <Save size={18}/>
      {isLoading ? loadingLabel : label}
    </Button>
  );
}
