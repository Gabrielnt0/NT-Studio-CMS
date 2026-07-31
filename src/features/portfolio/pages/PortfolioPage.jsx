import {
  ImagePlus,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import Modal from "../../../components/feedback/Modal";
import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import { supabase } from "../../../services/supabase";
import { usePortfolioProjects } from "../hooks/usePortfolioProjects";
import PortfolioProjectCard from "../components/PortfolioProjectCard";
import {
  deleteProjectImage,
  uploadProjectImage,
  uploadProjectSlideImage,
} from "../services/portfolioProjectImages.service";
import {
  createProjectSlide,
  deleteProjectSlide,
  listProjectSlides,
} from "../services/portfolioProjectSlides.service";


const categories = [
  "Todos",
  "Desenvolvimento",
  "Portfólio",
  "Plataforma",
  "Conteúdo",
];

const emptyForm = {
  title: "",
  slug: "",
  description: "",
  longDescription: "",
  client: "",
  projectDate: "",
  technologiesText: "",
  category: "Desenvolvimento",
  status: "Planejamento",
  featured: false,
  isPublished: false,
  displayOrder: 0,
  githubUrl: "",
  demoUrl: "",
  imageUrl: "",
};

function PortfolioPage() {
  const {
    projects,
    isLoading,
    isMutating,
    error,
    reloadProjects,
    createProject,
    updateProject,
    deleteProject,
  } = usePortfolioProjects();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [removeExistingImage, setRemoveExistingImage] = useState(false);
  const [existingSlides, setExistingSlides] = useState([]);
  const [selectedSlideFiles, setSelectedSlideFiles] = useState([]);
  const [removedSlideIds, setRemovedSlideIds] = useState([]);

  const filteredProjects = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesCategory =
        selectedCategory === "Todos" ||
        project.category === selectedCategory;

      const matchesSearch =
        project.title.toLowerCase().includes(normalizedSearch) ||
        project.description.toLowerCase().includes(normalizedSearch) ||
        project.category.toLowerCase().includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [projects, searchTerm, selectedCategory]);

  function openNewProjectModal() {
    setEditingProjectId(null);
    setFormData(emptyForm);
    setSelectedImage(null);
    setImagePreview("");
    setRemoveExistingImage(false);
    setExistingSlides([]);
    setSelectedSlideFiles([]);
    setRemovedSlideIds([]);
    setIsModalOpen(true);
  }

  async function openEditProjectModal(project) {
    setEditingProjectId(project.id);

    setFormData({
      title: project.title,
      slug: project.slug,
      description: project.description,
      longDescription: project.longDescription,
      client: project.client,
      projectDate: project.projectDate,
      technologiesText: project.technologies.join(", "),
      category: project.category,
      status: project.status,
      featured: project.featured,
      isPublished: project.isPublished,
      displayOrder: project.displayOrder,
      githubUrl: project.githubUrl,
      demoUrl: project.demoUrl,
      imageUrl: project.imageUrl ?? "",
    });

    setSelectedImage(null);
    setImagePreview(project.imageUrl ?? "");
    setRemoveExistingImage(false);
    setSelectedSlideFiles([]);
    setRemovedSlideIds([]);

    try {
      setExistingSlides(await listProjectSlides(project.id));
    } catch (requestError) {
      console.error("Erro ao carregar slides:", requestError);
      setExistingSlides([]);
      toast.error("Não foi possível carregar a galeria do projeto.");
    }

    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingProjectId(null);
    setFormData(emptyForm);

    setSelectedImage(null);
    setImagePreview("");
    setRemoveExistingImage(false);
    setExistingSlides([]);
    setSelectedSlideFiles([]);
    setRemovedSlideIds([]);
  }

  function handleInputChange(event) {
    const { name, value, type, checked } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleImageChange(event) {
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

    if (imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
    setRemoveExistingImage(false);
  }

  function getProjectImagePath(imageUrl) {
    if (!imageUrl) return "";

    const marker = "/storage/v1/object/public/portfolio-projects/";
    const markerIndex = imageUrl.indexOf(marker);

    if (markerIndex === -1) return "";

    return decodeURIComponent(
      imageUrl.slice(markerIndex + marker.length).split("?")[0],
    );
  }

  function handleRemoveImage() {
    if (imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setSelectedImage(null);
    setImagePreview("");
    setRemoveExistingImage(Boolean(formData.imageUrl));
  }

  function handleSlideFilesChange(event) {
    const files = Array.from(event.target.files ?? []);
    const allowedTypes = ["image/png", "image/jpeg", "image/webp"];
    const validFiles = files.filter(
      (file) =>
        allowedTypes.includes(file.type) && file.size <= 5 * 1024 * 1024,
    );

    if (validFiles.length !== files.length) {
      toast.error("Alguns slides foram ignorados. Use PNG, JPG ou WEBP de até 5 MB.");
    }

    setSelectedSlideFiles((current) => [...current, ...validFiles]);
    event.target.value = "";
  }

  function removeSelectedSlide(index) {
    setSelectedSlideFiles((current) =>
      current.filter((_, currentIndex) => currentIndex !== index),
    );
  }

  function removeExistingSlide(slideId) {
    setExistingSlides((current) =>
      current.filter((slide) => slide.id !== slideId),
    );
    setRemovedSlideIds((current) => [...current, slideId]);
  }

  function getStatusVariant(status) {
  const variants = {
    Publicado: "green",
    "Em desenvolvimento": "blue",
    Planejamento: "yellow",
    Rascunho: "zinc",
  };

  return variants[status] ?? "zinc";
}

  async function handleSubmit(event) {
    event.preventDefault();

    let uploadedImagePath = "";

    try {
      let imageUrl = formData.imageUrl || "";

      if (selectedImage) {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          throw userError;
        }

        if (!user) {
          throw new Error("Usuário não autenticado.");
        }

        const uploadedImage = await uploadProjectImage(
          selectedImage,
          user.id,
        );

        uploadedImagePath = uploadedImage.path;
        imageUrl = uploadedImage.publicUrl;
      } else if (removeExistingImage) {
        imageUrl = "";
      }

      const normalizedProject = {
        ...formData,
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        description: formData.description.trim(),
        longDescription: formData.longDescription.trim(),
        client: formData.client.trim(),
        technologies: formData.technologiesText
          .split(",")
          .map((technology) => technology.trim())
          .filter(Boolean),
        displayOrder: Number(formData.displayOrder) || 0,
        githubUrl: formData.githubUrl.trim(),
        demoUrl: formData.demoUrl.trim(),
        imageUrl,
        statusVariant: getStatusVariant(formData.status),
        updatedAt: "Agora",
      };

      const savedProject = editingProjectId
        ? await updateProject(editingProjectId, normalizedProject)
        : await createProject(normalizedProject);

      if (editingProjectId) {
        const oldImagePath = getProjectImagePath(formData.imageUrl);
        const imageWasChanged =
          selectedImage && formData.imageUrl && formData.imageUrl !== imageUrl;

        if ((imageWasChanged || removeExistingImage) && oldImagePath) {
          try {
            await deleteProjectImage(oldImagePath);
          } catch (deleteError) {
            console.error("Erro ao excluir imagem antiga:", deleteError);
          }
        }
      }

      for (const slideId of removedSlideIds) {
        await deleteProjectSlide(slideId);
      }

      if (selectedSlideFiles.length > 0) {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;
        if (!user) throw new Error("Usuário não autenticado.");

        const startOrder = existingSlides.length;

        for (const [index, file] of selectedSlideFiles.entries()) {
          const uploadedSlide = await uploadProjectSlideImage(
            file,
            user.id,
            savedProject.id,
          );

          try {
            await createProjectSlide({
              projectId: savedProject.id,
              imageUrl: uploadedSlide.publicUrl,
              storagePath: uploadedSlide.path,
              altText: `${savedProject.title} — imagem ${startOrder + index + 1}`,
              sortOrder: startOrder + index,
            });
          } catch (slideError) {
            await deleteProjectImage(uploadedSlide.path);
            throw slideError;
          }
        }
      }

      toast.success(
        editingProjectId
          ? "Projeto atualizado com sucesso."
          : "Projeto criado com sucesso.",
      );

      closeModal();
    } catch (requestError) {
      console.error("Erro ao salvar projeto:", requestError);

      if (uploadedImagePath) {
        try {
          await deleteProjectImage(uploadedImagePath);
        } catch (cleanupError) {
          console.error("Erro ao limpar upload não utilizado:", cleanupError);
        }
      }

      toast.error(
        requestError?.message || "Não foi possível salvar o projeto.",
      );
    }
  }

  function openDeleteConfirmation(project) {
    setProjectToDelete(project);
  }

  function closeDeleteConfirmation() {
    setProjectToDelete(null);
  }

  async function handleDeleteProject() {
    if (!projectToDelete) {
      return;
    }

    try {
      await deleteProject(projectToDelete.id);

      const imagePath = getProjectImagePath(projectToDelete.imageUrl);

      if (imagePath) {
        try {
          await deleteProjectImage(imagePath);
        } catch (deleteImageError) {
          console.error(
            "O projeto foi excluído, mas a imagem não foi removida:",
            deleteImageError,
          );
        }
      }

      toast.success(`"${projectToDelete.title}" foi excluído.`);
      closeDeleteConfirmation();
    } catch (requestError) {
      console.error(requestError);
      toast.error("Não foi possível excluir o projeto.");
    }
  }


  function openProject(project) {
    const projectUrl = project.demoUrl || project.githubUrl;

    if (!projectUrl) {
      toast.error("Este projeto ainda não possui um link cadastrado.");
      return;
    }

    window.open(projectUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <>
      <div className="space-y-6">
        <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-medium text-blue-400">
              Gerenciamento de conteúdo
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
              Projetos
            </h1>

            <p className="mt-2 text-zinc-400">
              Cadastre, edite e organize os projetos exibidos no seu portfólio.
            </p>
          </div>

          <Button onClick={openNewProjectModal}>
            <Plus size={18} />
            Novo projeto
          </Button>
        </section>

        <Card className="p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
              />

              <Input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Pesquisar projetos..."
                className="pl-11"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const isActive = selectedCategory === category;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={[
                      "rounded-xl px-3 py-2 text-sm font-medium transition",
                      isActive
                        ? "bg-blue-600 text-white"
                        : "border border-zinc-800 bg-zinc-950 text-zinc-400 hover:bg-zinc-800 hover:text-white",
                    ].join(" ")}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>
        </Card>

        <section className="space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-white">Todos os projetos</h2>

              <p className="mt-1 text-sm text-zinc-500">
                {filteredProjects.length} projeto
                {filteredProjects.length === 1 ? "" : "s"} encontrado
                {filteredProjects.length === 1 ? "" : "s"}.
              </p>
            </div>

            <Badge variant="zinc">{projects.length} cadastrados</Badge>
          </div>

          {isLoading ? (
            <Card className="flex min-h-64 flex-col items-center justify-center p-8 text-center">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-zinc-700 border-t-blue-500" />

              <p className="mt-4 text-sm font-medium text-zinc-300">
                Carregando projetos...
              </p>
            </Card>
          ) : error ? (
            <Card className="flex min-h-64 flex-col items-center justify-center p-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
                <Search size={24} />
              </div>

              <h3 className="mt-4 font-semibold text-white">
                Não foi possível carregar os projetos
              </h3>

              <p className="mt-2 max-w-md text-sm text-zinc-500">
                Verifique sua conexão e tente novamente.
              </p>

              <Button
                type="button"
                variant="secondary"
                onClick={reloadProjects}
                className="mt-5"
              >
                Tentar novamente
              </Button>
            </Card>
          ) : filteredProjects.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredProjects.map((project) => (
                <PortfolioProjectCard
                  key={project.id}
                  project={project}
                  statusVariant={getStatusVariant(project.status)}
                  onOpen={openProject}
                  onEdit={openEditProjectModal}
                  onDelete={openDeleteConfirmation}
                />
              ))}
            </div>
          ) : (
            <Card className="flex min-h-64 flex-col items-center justify-center p-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-800 text-zinc-400">
                <Search size={24} />
              </div>

              <h3 className="mt-4 font-semibold text-white">
                Nenhum projeto encontrado
              </h3>

              <p className="mt-2 max-w-md text-sm text-zinc-500">
                Tente alterar o termo pesquisado ou selecione outra categoria.
              </p>
            </Card>
          )}
        </section>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingProjectId ? "Editar projeto" : "Novo projeto"}
        description={
          editingProjectId
            ? "Atualize as informações do projeto selecionado."
            : "Preencha as informações para cadastrar um novo projeto."
        }
      >
        <form onSubmit={handleSubmit}>
          <div className="grid gap-5 p-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <Input
                label="Título"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Ex.: NT Studio CMS"
                required
              />
            </div>

            <Input
              label="Slug"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              placeholder="ex.: nt-studio-cms"
            />

            <Input
              label="Cliente"
              name="client"
              value={formData.client}
              onChange={handleInputChange}
              placeholder="Nome do cliente ou projeto próprio"
            />

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Descrição
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Descreva brevemente o projeto..."
                rows={4}
                required
                className="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Descrição completa
              </label>

              <textarea
                name="longDescription"
                value={formData.longDescription}
                onChange={handleInputChange}
                placeholder="Detalhe o contexto, processo, desafios e resultados do projeto..."
                rows={7}
                className="w-full resize-y rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
              />
            </div>

            <Input
              label="Data do projeto"
              name="projectDate"
              type="date"
              value={formData.projectDate}
              onChange={handleInputChange}
            />

            <Input
              label="Ordem de exibição"
              name="displayOrder"
              type="number"
              min="0"
              value={formData.displayOrder}
              onChange={handleInputChange}
            />

            <div className="md:col-span-2">
              <Input
                label="Tecnologias"
                name="technologiesText"
                value={formData.technologiesText}
                onChange={handleInputChange}
                placeholder="React, Supabase, Vite, Tailwind CSS"
              />
              <p className="mt-2 text-xs text-zinc-600">
                Separe cada tecnologia por vírgula.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Categoria
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
              >
                <option value="Desenvolvimento">Desenvolvimento</option>
                <option value="Portfólio">Portfólio</option>
                <option value="Plataforma">Plataforma</option>
                <option value="Conteúdo">Conteúdo</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
              >
                <option value="Planejamento">Planejamento</option>
                <option value="Em desenvolvimento">
                  Em desenvolvimento
                </option>
                <option value="Publicado">Publicado</option>
                <option value="Rascunho">Rascunho</option>
              </select>
            </div>

            <Input
              label="URL do GitHub"
              name="githubUrl"
              type="url"
              value={formData.githubUrl}
              onChange={handleInputChange}
              placeholder="https://github.com/..."
            />

            <Input
              label="URL do projeto"
              name="demoUrl"
              type="url"
              value={formData.demoUrl}
              onChange={handleInputChange}
              placeholder="https://..."
            />

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Imagem de capa
              </label>

              <input
                id="project-image"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />

              {imagePreview ? (
                <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
                  <img
                    src={imagePreview}
                    alt="Prévia da imagem de capa"
                    className="h-56 w-full object-cover"
                  />

                  <div className="flex flex-col gap-3 border-t border-zinc-800 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-medium text-zinc-200">
                        {selectedImage?.name || "Imagem atual do projeto"}
                      </p>

                      <p className="mt-1 text-xs text-zinc-500">
                        Imagem selecionada para este projeto.
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <label
                        htmlFor="project-image"
                        className="cursor-pointer rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
                      >
                        Trocar imagem
                      </label>

                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/20"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <label
                  htmlFor="project-image"
                  className="flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-zinc-900/50 px-6 py-8 text-center transition hover:border-blue-500 hover:bg-blue-500/5"
                >
                  <ImagePlus size={28} className="text-zinc-500" />

                  <span className="mt-3 text-sm font-medium text-zinc-300">
                    Selecionar imagem
                  </span>

                  <span className="mt-1 text-xs text-zinc-600">
                    PNG, JPG ou WEBP — máximo de 5 MB
                  </span>
                </label>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Galeria do projeto
              </label>

              <input
                id="project-slides"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                multiple
                onChange={handleSlideFilesChange}
                className="hidden"
              />

              <label
                htmlFor="project-slides"
                className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-700 bg-zinc-900/50 px-4 py-5 text-sm font-medium text-zinc-300 transition hover:border-blue-500 hover:bg-blue-500/5"
              >
                <ImagePlus size={19} />
                Adicionar imagens à galeria
              </label>

              {(existingSlides.length > 0 || selectedSlideFiles.length > 0) && (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {existingSlides.map((slide) => (
                    <div
                      key={slide.id}
                      className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950"
                    >
                      <img
                        src={slide.imageUrl}
                        alt={slide.altText || "Slide do projeto"}
                        className="h-32 w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingSlide(slide.id)}
                        className="w-full border-t border-zinc-800 px-3 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
                      >
                        Remover slide
                      </button>
                    </div>
                  ))}

                  {selectedSlideFiles.map((file, index) => (
                    <div
                      key={`${file.name}-${file.lastModified}-${index}`}
                      className="rounded-xl border border-zinc-800 bg-zinc-950 p-3"
                    >
                      <p className="truncate text-sm text-zinc-300">{file.name}</p>
                      <button
                        type="button"
                        onClick={() => removeSelectedSlide(index)}
                        className="mt-2 text-sm font-medium text-red-400 transition hover:text-red-300"
                      >
                        Remover seleção
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <label className="flex cursor-pointer items-center gap-3 md:col-span-2">
              <input
                type="checkbox"
                name="isPublished"
                checked={formData.isPublished}
                onChange={handleInputChange}
                className="h-4 w-4 rounded border-zinc-700 bg-zinc-950 text-blue-600 focus:ring-blue-500"
              />

              <span className="text-sm text-zinc-300">
                Publicar este projeto no site
              </span>
            </label>

            <label className="flex cursor-pointer items-center gap-3 md:col-span-2">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleInputChange}
                className="h-4 w-4 rounded border-zinc-700 bg-zinc-950 text-blue-600 focus:ring-blue-500"
              />

              <span className="text-sm text-zinc-300">
                Exibir este projeto em destaque no portfólio
              </span>
            </label>
          </div>

          <footer className="flex flex-col-reverse gap-3 border-t border-zinc-800 px-6 py-5 sm:flex-row sm:justify-end">
            <Button type="button" variant="secondary" onClick={closeModal}>
              Cancelar
            </Button>

            <Button
            type="submit"
           disabled={isMutating}
          >
              {isMutating
                ? "Salvando..."
                : editingProjectId
                  ? "Salvar alterações"
                  : "Criar projeto"}
            </Button>
          </footer>
        </form>
      </Modal>

      <Modal
        isOpen={Boolean(projectToDelete)}
        onClose={closeDeleteConfirmation}
        title="Excluir projeto"
        description="Esta ação não poderá ser desfeita."
        size="md"
      >
        <div className="p-6">
          <div className="flex items-start gap-4 rounded-xl border border-red-500/20 bg-red-500/5 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
              <Trash2 size={19} />
            </div>

            <div>
              <h3 className="font-medium text-zinc-100">
                Confirmar exclusão
              </h3>

              <p className="mt-1 text-sm leading-6 text-zinc-400">
                O projeto{" "}
                <strong className="font-semibold text-white">
                  {projectToDelete?.title}
                </strong>{" "}
                será removido da lista.
              </p>
            </div>
          </div>
        </div>

        <footer className="flex flex-col-reverse gap-3 border-t border-zinc-800 px-6 py-5 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={closeDeleteConfirmation}
          >
            Cancelar
          </Button>

           <Button
           type="button"
           variant="danger"
           disabled={isMutating}
           onClick={handleDeleteProject}
          >
            <Trash2 size={17} />
            Excluir projeto
          </Button>
        </footer>
      </Modal>
    </>
  );
}

export default PortfolioPage;