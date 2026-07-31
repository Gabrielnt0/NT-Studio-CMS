import {
  Camera,
  Globe2,
  Mail,
  MapPin,
  Phone,
  Save,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import { supabase } from "../../../services/supabase";
import { useProfile } from "../hooks/useProfile";
import {
  deleteProfileAvatar,
  getProfileAvatarPath,
  uploadProfileAvatar,
} from "../services/profileAvatar.service";

const emptyForm = {
  fullName: "",
  professionalTitle: "",
  shortBio: "",
  bio: "",
  location: "",
  email: "",
  phone: "",
  githubUrl: "",
  linkedinUrl: "",
  websiteUrl: "",
  resumeUrl: "",
  avatarUrl: "",
  availableForWork: false,
};

export default function ProfilePage() {
  const {
    profile,
    isLoading,
    isMutating,
    error,
    reloadProfile,
    upsertProfile,
  } = useProfile();

  const [formData, setFormData] = useState(emptyForm);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [removeExistingAvatar, setRemoveExistingAvatar] = useState(false);

  useEffect(() => {
    if (!profile) return;

    setFormData({
      fullName: profile.fullName,
      professionalTitle: profile.professionalTitle,
      shortBio: profile.shortBio,
      bio: profile.bio,
      location: profile.location,
      email: profile.email,
      phone: profile.phone,
      githubUrl: profile.githubUrl,
      linkedinUrl: profile.linkedinUrl,
      websiteUrl: profile.websiteUrl,
      resumeUrl: profile.resumeUrl,
      avatarUrl: profile.avatarUrl,
      availableForWork: profile.availableForWork,
    });

    setAvatarPreview(profile.avatarUrl);
  }, [profile]);

  function handleInputChange(event) {
    const { name, value, type, checked } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleAvatarChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Escolha uma imagem PNG, JPG ou WEBP.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 5 MB.");
      event.target.value = "";
      return;
    }

    if (avatarPreview.startsWith("blob:")) {
      URL.revokeObjectURL(avatarPreview);
    }

    setSelectedAvatar(file);
    setAvatarPreview(URL.createObjectURL(file));
    setRemoveExistingAvatar(false);
  }

  function handleRemoveAvatar() {
    if (avatarPreview.startsWith("blob:")) {
      URL.revokeObjectURL(avatarPreview);
    }

    setSelectedAvatar(null);
    setAvatarPreview("");
    setRemoveExistingAvatar(Boolean(formData.avatarUrl));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    let uploadedAvatarPath = "";

    try {
      let avatarUrl = formData.avatarUrl;

      if (selectedAvatar) {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;
        if (!user) throw new Error("Usuário não autenticado.");

        const uploadedAvatar = await uploadProfileAvatar(
          selectedAvatar,
          user.id,
        );

        uploadedAvatarPath = uploadedAvatar.path;
        avatarUrl = uploadedAvatar.publicUrl;
      } else if (removeExistingAvatar) {
        avatarUrl = "";
      }

      const oldAvatarPath = getProfileAvatarPath(formData.avatarUrl);

      await upsertProfile({
        ...formData,
        avatarUrl,
      });

      const avatarWasChanged =
        selectedAvatar && formData.avatarUrl && formData.avatarUrl !== avatarUrl;

      if ((avatarWasChanged || removeExistingAvatar) && oldAvatarPath) {
        try {
          await deleteProfileAvatar(oldAvatarPath);
        } catch (deleteError) {
          console.error("Erro ao excluir avatar antigo:", deleteError);
        }
      }

      setFormData((current) => ({ ...current, avatarUrl }));
      setSelectedAvatar(null);
      setRemoveExistingAvatar(false);
      setAvatarPreview(avatarUrl);

      toast.success("Perfil atualizado com sucesso.");
    } catch (requestError) {
      console.error("Erro ao salvar perfil:", requestError);

      if (uploadedAvatarPath) {
        try {
          await deleteProfileAvatar(uploadedAvatarPath);
        } catch (cleanupError) {
          console.error("Erro ao limpar upload não utilizado:", cleanupError);
        }
      }

      toast.error(
        requestError?.message || "Não foi possível atualizar o perfil.",
      );
    }
  }

  if (isLoading) {
    return (
      <Card className="flex min-h-72 flex-col items-center justify-center p-8">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-zinc-700 border-t-blue-500" />
        <p className="mt-4 text-sm text-zinc-400">Carregando perfil...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="flex min-h-72 flex-col items-center justify-center p-8 text-center">
        <h2 className="font-semibold text-white">
          Não foi possível carregar o perfil
        </h2>
        <p className="mt-2 text-sm text-zinc-500">
          Verifique sua conexão e tente novamente.
        </p>
        <Button variant="secondary" onClick={reloadProfile} className="mt-5">
          Tentar novamente
        </Button>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-medium text-blue-400">
            Informações profissionais
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
            Perfil
          </h1>

          <p className="mt-2 text-zinc-400">
            Gerencie as informações principais exibidas no seu portfólio.
          </p>
        </div>

        <Button type="submit" disabled={isMutating}>
          <Save size={18} />
          {isMutating ? "Salvando..." : "Salvar alterações"}
        </Button>
      </section>

      <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
        <Card className="h-fit p-6">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Foto do perfil"
                  className="h-36 w-36 rounded-3xl border border-zinc-800 object-cover"
                />
              ) : (
                <div className="flex h-36 w-36 items-center justify-center rounded-3xl border border-dashed border-zinc-700 bg-zinc-950 text-zinc-500">
                  <UserRound size={48} />
                </div>
              )}

              <label
                htmlFor="profile-avatar"
                className="absolute -bottom-2 -right-2 flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900 text-zinc-300 shadow-lg transition hover:bg-zinc-800 hover:text-white"
                title="Selecionar foto"
              >
                <Camera size={19} />
              </label>

              <input
                id="profile-avatar"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-white">
              {formData.fullName || "Seu nome"}
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              {formData.professionalTitle || "Seu título profissional"}
            </p>

            {avatarPreview && (
              <button
                type="button"
                onClick={handleRemoveAvatar}
                className="mt-4 text-sm font-medium text-red-400 transition hover:text-red-300"
              >
                Remover foto
              </button>
            )}

            <p className="mt-5 text-xs leading-5 text-zinc-600">
              PNG, JPG ou WEBP. Tamanho máximo de 5 MB.
            </p>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-white">
              Informações principais
            </h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <Input
                label="Nome completo"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Gabriel Andrade"
                required
              />

              <Input
                label="Título profissional"
                name="professionalTitle"
                value={formData.professionalTitle}
                onChange={handleInputChange}
                placeholder="Desenvolvedor Front-end"
                required
              />

              <Input
                label="Localização"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Brasil"
              />

              <Input
                label="E-mail profissional"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="contato@exemplo.com"
              />

              <Input
                label="Telefone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+55 00 00000-0000"
              />

              <label className="flex items-center gap-3 self-end rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3">
                <input
                  type="checkbox"
                  name="availableForWork"
                  checked={formData.availableForWork}
                  onChange={handleInputChange}
                  className="h-4 w-4 rounded border-zinc-700 bg-zinc-950 text-blue-600 focus:ring-blue-500"
                />

                <span className="text-sm text-zinc-300">
                  Disponível para novos trabalhos
                </span>
              </label>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-white">Apresentação</h2>

            <div className="mt-5 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  Resumo curto
                </label>

                <textarea
                  name="shortBio"
                  value={formData.shortBio}
                  onChange={handleInputChange}
                  rows={3}
                  maxLength={220}
                  placeholder="Uma apresentação curta para o topo do portfólio."
                  className="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                />

                <p className="mt-2 text-right text-xs text-zinc-600">
                  {formData.shortBio.length}/220
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  Biografia
                </label>

                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={7}
                  placeholder="Conte sua trajetória, especialidades e objetivos profissionais."
                  className="w-full resize-y rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-white">
              Links profissionais
            </h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <Input
                label="GitHub"
                name="githubUrl"
                type="url"
                value={formData.githubUrl}
                onChange={handleInputChange}
                placeholder="https://github.com/..."
              />

              <Input
                label="LinkedIn"
                name="linkedinUrl"
                type="url"
                value={formData.linkedinUrl}
                onChange={handleInputChange}
                placeholder="https://linkedin.com/in/..."
              />

              <Input
                label="Site pessoal"
                name="websiteUrl"
                type="url"
                value={formData.websiteUrl}
                onChange={handleInputChange}
                placeholder="https://..."
              />

              <Input
                label="Currículo"
                name="resumeUrl"
                type="url"
                value={formData.resumeUrl}
                onChange={handleInputChange}
                placeholder="https://..."
              />
            </div>

            <div className="mt-6 flex flex-wrap gap-3 text-sm text-zinc-500">
              <span className="inline-flex items-center gap-2">
                <Globe2 size={16} /> GitHub
              </span>
              <span className="inline-flex items-center gap-2">
                <Globe2 size={16} /> LinkedIn
              </span>
              <span className="inline-flex items-center gap-2">
                <Globe2 size={16} /> Site
              </span>
              <span className="inline-flex items-center gap-2">
                <Mail size={16} /> E-mail
              </span>
              <span className="inline-flex items-center gap-2">
                <Phone size={16} /> Telefone
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin size={16} /> Localização
              </span>
            </div>
          </Card>
        </div>
      </div>
    </form>
  );
}