import {
  ExternalLink,
  ImagePlus,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import Modal from "../components/feedback/Modal";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";

const initialProjects = [
  {
    id: 1,
    title: "NT Studio CMS",
    description: "Painel administrativo para gerenciamento do portfólio.",
    category: "Desenvolvimento",
    status: "Em desenvolvimento",
    statusVariant: "blue",
    featured: true,
    updatedAt: "Hoje",
    githubUrl: "https://github.com/Gabrielnt0/NT-Studio-CMS",
    demoUrl: "",
  },
  {
    id: 2,
    title: "Portfólio Gabriel",
    description: "Portfólio profissional com projetos e experiências.",
    category: "Portfólio",
    status: "Publicado",
    statusVariant: "green",
    featured: true,
    updatedAt: "Há 2 dias",
    githubUrl: "https://github.com/Gabrielnt0/portfolio",
    demoUrl: "https://gabrielnt0.github.io/portfolio/",
  },
  {
    id: 3,
    title: "Affilint",
    description: "Plataforma para organização e divulgação de links.",
    category: "Plataforma",
    status: "Planejamento",
    statusVariant: "yellow",
    featured: false,
    updatedAt: "Há 5 dias",
    githubUrl: "",
    demoUrl: "",
  },
  {
    id: 4,
    title: "TOONNT",
    description: "Universo de conteúdo infantil e produção audiovisual.",
    category: "Conteúdo",
    status: "Publicado",
    statusVariant: "green",
    featured: true,
    updatedAt: "Há 1 semana",
    githubUrl: "",
    demoUrl: "",
  },
];

const categories = [
  "Todos",
  "Desenvolvimento",
  "Portfólio",
  "Plataforma",
  "Conteúdo",
];

const emptyForm = {
  title: "",
  description: "",
  category: "Desenvolvimento",
  status: "Planejamento",
  featured: false,
  githubUrl: "",
  demoUrl: "",
};

function Projects() {
  const [projects, setProjects] = useState(initialProjects);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [projectToDelete, setProjectToDelete] = useState(null);

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
    setIsModalOpen(true);
  }

  function openEditProjectModal(project) {
    setEditingProjectId(project.id);

    setFormData({
      title: project.title,
      description: project.description,
      category: project.category,
      status: project.status,
      featured: project.featured,
      githubUrl: project.githubUrl,
      demoUrl: project.demoUrl,
    });

    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingProjectId(null);
    setFormData(emptyForm);
  }

  function handleInputChange(event) {
    const { name, value, type, checked } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
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

  function handleSubmit(event) {
    event.preventDefault();

    const normalizedProject = {
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
      githubUrl: formData.githubUrl.trim(),
      demoUrl: formData.demoUrl.trim(),
      statusVariant: getStatusVariant(formData.status),
      updatedAt: "Agora",
    };

    if (editingProjectId) {
      setProjects((currentProjects) =>
        currentProjects.map((project) =>
          project.id === editingProjectId
            ? {
                ...project,
                ...normalizedProject,
              }
            : project,
        ),
      );

      toast.success("Projeto atualizado com sucesso.");
    } else {
      setProjects((currentProjects) => [
        {
          id: Date.now(),
          ...normalizedProject,
        },
        ...currentProjects,
      ]);

      toast.success("Projeto criado com sucesso.");
    }

    closeModal();
  }

  function openDeleteConfirmation(project) {
    setProjectToDelete(project);
  }

  function closeDeleteConfirmation() {
    setProjectToDelete(null);
  }

  function handleDeleteProject() {
    if (!projectToDelete) {
      return;
    }

    setProjects((currentProjects) =>
      currentProjects.filter(
        (project) => project.id !== projectToDelete.id,
      ),
    );

    toast.success(`"${projectToDelete.title}" foi excluído.`);

    closeDeleteConfirmation();
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

        <Card>
          <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-5">
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

          {filteredProjects.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead>
                  <tr className="border-b border-zinc-800 text-xs uppercase tracking-wider text-zinc-600">
                    <th className="px-6 py-4 font-medium">Projeto</th>
                    <th className="px-6 py-4 font-medium">Categoria</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Destaque</th>
                    <th className="px-6 py-4 font-medium">Atualização</th>
                    <th className="px-6 py-4 text-right font-medium">Ações</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-zinc-800">
                  {filteredProjects.map((project) => (
                    <tr
                      key={project.id}
                      className="transition hover:bg-zinc-900/70"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 text-sm font-bold text-blue-400">
                            {project.title.slice(0, 2).toUpperCase()}
                          </div>

                          <div>
                            <p className="font-medium text-zinc-100">
                              {project.title}
                            </p>

                            <p className="mt-1 max-w-sm text-sm text-zinc-500">
                              {project.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-sm text-zinc-400">
                        {project.category}
                      </td>

                      <td className="px-6 py-5">
                        <Badge variant={project.statusVariant}>
                          {project.status}
                        </Badge>
                      </td>

                      <td className="px-6 py-5">
                        <Badge variant={project.featured ? "purple" : "zinc"}>
                          {project.featured ? "Sim" : "Não"}
                        </Badge>
                      </td>

                      <td className="px-6 py-5 text-sm text-zinc-500">
                        {project.updatedAt}
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Abrir ${project.title}`}
                            title="Abrir projeto"
                          >
                            <ExternalLink size={17} />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditProjectModal(project)}
                            aria-label={`Editar ${project.title}`}
                            title="Editar projeto"
                          >
                            <Pencil size={17} />
                          </Button>

                          <Button
                            variant="danger"
                            size="icon"
                            onClick={() => openDeleteConfirmation(project)}
                            aria-label={`Excluir ${project.title}`}
                            title="Excluir projeto"
                          >
                            <Trash2 size={17} />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Mais opções para ${project.title}`}
                            title="Mais opções"
                          >
                            <MoreHorizontal size={18} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-800 text-zinc-400">
                <Search size={24} />
              </div>

              <h3 className="mt-4 font-semibold text-white">
                Nenhum projeto encontrado
              </h3>

              <p className="mt-2 max-w-md text-sm text-zinc-500">
                Tente alterar o termo pesquisado ou selecione outra categoria.
              </p>
            </div>
          )}
        </Card>
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

              <button
                type="button"
                className="flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-zinc-900/50 px-6 py-8 text-center transition hover:border-blue-500 hover:bg-blue-500/5"
              >
                <ImagePlus size={28} className="text-zinc-500" />

                <span className="mt-3 text-sm font-medium text-zinc-300">
                  Selecionar imagem
                </span>

                <span className="mt-1 text-xs text-zinc-600">
                  PNG, JPG ou WEBP
                </span>
              </button>
            </div>

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

            <Button type="submit">
              {editingProjectId ? "Salvar alterações" : "Criar projeto"}
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

export default Projects;