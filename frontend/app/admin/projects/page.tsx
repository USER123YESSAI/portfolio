"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Archive,
  Star,
  Search,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  FolderOpen,
  X,
  Check,
  Loader2,
} from "lucide-react";
import {
  adminGetProjects,
  adminCreateProject,
  adminUpdateProject,
  adminDeleteProject,
  adminArchiveProject,
  getAssetUrl,
} from "@/lib/api";
import { parseTechnologies } from "@/lib/utils";
import type { Project } from "@/types";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    titre: "",
    description: "",
    technologies: "",
    categorie: "Full-Stack",
    lien_demo: "",
    lien_github: "",
    date_realisation: "",
    mis_en_avant: false,
    archive: false,
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [statusMsg, setStatusMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchProjects = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const data = await adminGetProjects();
      setProjects(data);
    } catch (err: any) {
      console.error("Erreur fetchProjects:", err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Erreur lors du chargement des projets.";
      setStatusMsg({
        type: "error",
        text: `Erreur: ${msg}`,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects(true);
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setForm({
      titre: "",
      description: "",
      technologies: "",
      categorie: "Full-Stack",
      lien_demo: "",
      lien_github: "",
      date_realisation: "",
      mis_en_avant: false,
      archive: false,
    });
    setSelectedFiles([]);
    setExistingImages([]);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project: Project) => {
    setEditingId(project.id);
    setForm({
      titre: project.titre,
      description: project.description,
      technologies: Array.isArray(project.technologies)
        ? project.technologies.join(", ")
        : (project.technologies as unknown as string) || "",
      categorie: project.categorie || "Full-Stack",
      lien_demo: project.lien_demo || "",
      lien_github: project.lien_github || "",
      date_realisation: project.date_realisation
        ? project.date_realisation.split("T")[0]
        : "",
      mis_en_avant: project.mis_en_avant || false,
      archive: project.archive || false,
    });
    setSelectedFiles([]);
    const currentImgs =
      project.images && project.images.length > 0
        ? project.images
        : project.image
        ? [project.image]
        : [];
    setExistingImages(currentImgs);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMsg(null);

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        formData.append(key, String(val));
      });

      // Images conservées
      formData.append("existing_images", JSON.stringify(existingImages));

      // Nouvelles images ajoutées
      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });
      if (selectedFiles.length > 0) {
        formData.append("image", selectedFiles[0]);
      }

      if (editingId) {
        await adminUpdateProject(editingId, formData);
        setStatusMsg({
          type: "success",
          text: "Projet modifié avec succès.",
        });
      } else {
        await adminCreateProject(formData);
        setStatusMsg({
          type: "success",
          text: "Projet créé avec succès.",
        });
      }
      setIsModalOpen(false);
      fetchProjects();
    } catch (err: any) {
      console.error("Erreur projet :", err);
      const serverMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Erreur lors de l'enregistrement du projet.";
      setStatusMsg({
        type: "error",
        text: `Erreur: ${serverMsg}`,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce projet ?"))
      return;
    try {
      await adminDeleteProject(id);
      setStatusMsg({ type: "success", text: "Projet supprimé." });
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch {
      setStatusMsg({
        type: "error",
        text: "Erreur lors de la suppression.",
      });
    }
  };

  const handleArchive = async (id: number) => {
    try {
      await adminArchiveProject(id);
      setStatusMsg({
        type: "success",
        text: "Statut d'archive mis à jour.",
      });
      fetchProjects();
    } catch {
      setStatusMsg({
        type: "error",
        text: "Erreur lors de l'archivage.",
      });
    }
  };

  const categories = [
    "Full-Stack",
    "Front-End",
    "Back-End",
    "Mobile",
    "Autre",
  ];
  const filteredProjects = projects.filter((p) => {
    if (filterCat && p.categorie !== filterCat) return false;
    if (
      search &&
      !p.titre.toLowerCase().includes(search.toLowerCase()) &&
      !p.description.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  const inputClass =
    "w-full px-3.5 py-2.5 bg-white border border-[#e2e8f0] rounded-lg text-sm text-[#0f172a] placeholder:text-gray-400 focus:outline-none focus:border-[#0ea5e9] focus:ring-1 focus:ring-[#0ea5e9] transition-all";

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif-custom text-[#0f172a]">
            Gestion des Projets
          </h1>
          <p className="text-[#475569] text-sm mt-1">
            Gérez vos réalisations, images, liens de démo et code source ({projects.length} projet{projects.length > 1 ? "s" : ""}).
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0ea5e9] hover:bg-[#0284c7] text-white text-sm font-semibold rounded-lg transition-all shadow-xs"
        >
          <Plus size={18} />
          <span>Nouveau Projet</span>
        </button>
      </div>

      {/* Status feedback */}
      {statusMsg && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
            statusMsg.type === "success"
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          {statusMsg.type === "success" ? (
            <CheckCircle size={18} />
          ) : (
            <AlertCircle size={18} />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un projet par titre ou description..."
            className="w-full pl-10 pr-10 py-2.5 bg-white border border-[#e2e8f0] rounded-lg text-sm text-[#0f172a] placeholder:text-gray-400 focus:outline-none focus:border-[#0ea5e9] transition-all shadow-xs"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full"
              title="Effacer la recherche"
            >
              <X size={15} />
            </button>
          )}
        </div>
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="px-4 py-2.5 bg-white border border-[#e2e8f0] rounded-lg text-sm text-[#0f172a] focus:outline-none focus:border-[#0ea5e9] shadow-xs"
        >
          <option value="">Toutes les catégories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-3 border-[#0ea5e9] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-12 text-center text-gray-500">
          <FolderOpen size={40} className="mx-auto mb-3 opacity-50" />
          <p className="font-medium text-[#0f172a]">Aucun projet ne correspond à votre recherche.</p>
          <p className="text-xs text-gray-400 mt-1">Ajoutez un projet ou réinitialisez les filtres.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const imageUrl = getAssetUrl(project.image);
            const techs = parseTechnologies(project.technologies);

            return (
              <div
                key={project.id}
                className={`bg-white border border-[#e2e8f0] rounded-xl overflow-hidden shadow-xs flex flex-col justify-between ${
                  project.archive ? "opacity-60 bg-gray-50" : ""
                }`}
              >
                {/* Image header */}
                <div>
                  <div className="relative h-44 bg-gray-900 overflow-hidden">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={project.titre}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#0ea5e9] flex items-center justify-center text-white text-2xl font-bold font-serif-custom">
                        {project.titre.charAt(0)}
                      </div>
                    )}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="bg-[#0ea5e9] text-white px-2.5 py-0.5 rounded text-xs font-semibold">
                        {project.categorie}
                      </span>
                      {project.mis_en_avant && (
                        <span className="bg-[#f59e0b] text-white px-2 py-0.5 rounded text-xs font-semibold inline-flex items-center gap-1">
                          <Star size={12} className="fill-white" />
                          Featured
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold font-serif-custom text-[#0f172a] mb-1.5">
                      {project.titre}
                    </h3>
                    <p className="text-sm text-[#475569] line-clamp-2 mb-3">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {techs.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 bg-[#e0f2fe] text-[#0f172a] rounded text-xs font-mono"
                        >
                          {tech}
                        </span>
                      ))}
                      {techs.length > 4 && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-xs font-mono">
                          +{techs.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer action buttons */}
                <div className="px-5 py-3.5 border-t border-[#e2e8f0] bg-[#f0f6fb] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {project.lien_demo && project.lien_demo !== "#" && (
                      <a
                        href={project.lien_demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#0ea5e9] hover:underline inline-flex items-center gap-1 font-semibold"
                      >
                        <ExternalLink size={13} />
                        Démo
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleArchive(project.id)}
                      title={project.archive ? "Désarchiver" : "Archiver"}
                      className="p-1.5 rounded text-gray-600 hover:bg-white hover:text-[#f59e0b] border border-transparent hover:border-[#e2e8f0] transition-all"
                    >
                      <Archive size={15} />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(project)}
                      title="Modifier"
                      className="p-1.5 rounded text-gray-700 hover:bg-white hover:text-[#0ea5e9] border border-transparent hover:border-[#e2e8f0] transition-all"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      title="Supprimer"
                      className="p-1.5 rounded text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal / Formulaire d'édition et création */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#e2e8f0] mb-6">
              <h2 className="text-xl font-bold font-serif-custom text-[#0f172a]">
                {editingId ? "Modifier le projet" : "Nouveau projet"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0f172a] mb-1.5">
                    Titre du projet *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.titre}
                    onChange={(e) =>
                      setForm({ ...form, titre: e.target.value })
                    }
                    className={inputClass}
                    placeholder="ex: Plateforme E-learning"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0f172a] mb-1.5">
                    Catégorie *
                  </label>
                  <select
                    value={form.categorie}
                    onChange={(e) =>
                      setForm({ ...form, categorie: e.target.value })
                    }
                    className={inputClass}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0f172a] mb-1.5">
                  Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className={`${inputClass} resize-none`}
                  placeholder="Décrivez les fonctionnalités et la valeur du projet..."
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0f172a] mb-1.5">
                    Technologies (séparées par des virgules) *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.technologies}
                    onChange={(e) =>
                      setForm({ ...form, technologies: e.target.value })
                    }
                    className={inputClass}
                    placeholder="React, Next.js, TypeScript, Node.js"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0f172a] mb-1.5">
                    Date de réalisation
                  </label>
                  <input
                    type="date"
                    value={form.date_realisation}
                    onChange={(e) =>
                      setForm({ ...form, date_realisation: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0f172a] mb-1.5">
                    Lien démo live (URL)
                  </label>
                  <input
                    type="url"
                    value={form.lien_demo}
                    onChange={(e) =>
                      setForm({ ...form, lien_demo: e.target.value })
                    }
                    className={inputClass}
                    placeholder="https://mon-projet.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0f172a] mb-1.5">
                    Lien GitHub (URL)
                  </label>
                  <input
                    type="url"
                    value={form.lien_github}
                    onChange={(e) =>
                      setForm({ ...form, lien_github: e.target.value })
                    }
                    className={inputClass}
                    placeholder="https://github.com/yn/projet"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0f172a]">
                    Images du projet (une ou plusieurs)
                  </label>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {existingImages.length + selectedFiles.length} image(s) au total
                  </span>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setSelectedFiles((prev) => [...prev, ...files]);
                  }}
                  className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#e0f2fe] file:text-[#0ea5e9] hover:file:bg-[#e2e8f0] cursor-pointer"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  💡 Astuce : Vous pouvez sélectionner plusieurs images d&apos;un coup. La première image servira de couverture principale.
                </p>

                {/* Galerie des miniatures */}
                {(existingImages.length > 0 || selectedFiles.length > 0) && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-3 pt-3 border-t border-[#e2e8f0]">
                    {/* Images existantes */}
                    {existingImages.map((img, idx) => (
                      <div
                        key={`existing-${idx}`}
                        className="relative group rounded-lg overflow-hidden border border-[#e2e8f0] aspect-video bg-slate-50"
                      >
                        <Image
                          src={getAssetUrl(img) || img}
                          alt={`Aperçu ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                        {idx === 0 && (
                          <span className="absolute top-1 left-1 bg-[#0ea5e9] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs z-10">
                            Principale
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() =>
                            setExistingImages((prev) =>
                              prev.filter((_, i) => i !== idx)
                            )
                          }
                          className="absolute top-1 right-1 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full opacity-80 group-hover:opacity-100 transition-opacity z-10 cursor-pointer"
                          title="Supprimer cette image"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}

                    {/* Nouvelles images sélectionnées */}
                    {selectedFiles.map((file, idx) => {
                      const objectUrl = URL.createObjectURL(file);
                      const isMain = existingImages.length === 0 && idx === 0;
                      return (
                        <div
                          key={`new-${idx}`}
                          className="relative group rounded-lg overflow-hidden border-2 border-dashed border-[#0ea5e9] aspect-video bg-sky-50"
                        >
                          <Image
                            src={objectUrl}
                            alt={`Nouvelle ${idx + 1}`}
                            fill
                            className="object-cover"
                          />
                          {isMain && (
                            <span className="absolute top-1 left-1 bg-[#0ea5e9] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs z-10">
                              Principale
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedFiles((prev) =>
                                prev.filter((_, i) => i !== idx)
                              )
                            }
                            className="absolute top-1 right-1 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full opacity-80 group-hover:opacity-100 transition-opacity z-10 cursor-pointer"
                            title="Retirer cette image"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-sm text-[#0f172a] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.mis_en_avant}
                    onChange={(e) =>
                      setForm({ ...form, mis_en_avant: e.target.checked })
                    }
                    className="rounded border-[#e2e8f0] text-[#0ea5e9] focus:ring-[#0ea5e9]"
                  />
                  <span className="inline-flex items-center gap-1.5">
                    <Star size={14} className="fill-amber-400 text-amber-500" />
                    <span>Mettre en avant (Featured)</span>
                  </span>
                </label>
                <label className="flex items-center gap-2 text-sm text-[#0f172a] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.archive}
                    onChange={(e) =>
                      setForm({ ...form, archive: e.target.checked })
                    }
                    className="rounded border-[#e2e8f0] text-[#0ea5e9] focus:ring-[#0ea5e9]"
                  />
                  <span>Archiver le projet</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e2e8f0]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-white hover:bg-gray-100 text-gray-700 border border-[#e2e8f0] text-sm font-semibold rounded-lg transition-all"
                >
                  <X size={15} />
                  <span>Annuler</span>
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0ea5e9] hover:bg-[#0284c7] disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-all shadow-xs"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Enregistrement...</span>
                    </>
                  ) : editingId ? (
                    <>
                      <Check size={16} />
                      <span>Enregistrer les modifications</span>
                    </>
                  ) : (
                    <>
                      <Plus size={16} />
                      <span>Créer le projet</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
