"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Archive,
  Star,
  Search,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  FolderOpen,
  X,
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
  const [imageFile, setImageFile] = useState<File | null>(null);
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
    } catch {
      setStatusMsg({
        type: "error",
        text: "Erreur lors du chargement des projets.",
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
    setImageFile(null);
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
    setImageFile(null);
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
      if (imageFile) {
        formData.append("image", imageFile);
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
    } catch {
      setStatusMsg({
        type: "error",
        text: "Erreur lors de l'enregistrement du projet.",
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
    "w-full px-3.5 py-2.5 bg-white border border-[#e5dccb] rounded-lg text-sm text-[#111827] placeholder:text-gray-400 focus:outline-none focus:border-[#1a3826] focus:ring-1 focus:ring-[#1a3826] transition-all";

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif-custom text-[#111827]">
            Gestion des Projets
          </h1>
          <p className="text-[#4b5563] text-sm mt-1">
            Gérez vos réalisations, images, liens de démo et code source ({projects.length} projet{projects.length > 1 ? "s" : ""}).
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1a3826] hover:bg-[#142a1d] text-white text-sm font-semibold rounded-lg transition-all shadow-xs"
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
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#e5dccb] rounded-lg text-sm text-[#111827] placeholder:text-gray-400 focus:outline-none focus:border-[#1a3826] transition-all shadow-xs"
          />
        </div>
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="px-4 py-2.5 bg-white border border-[#e5dccb] rounded-lg text-sm text-[#111827] focus:outline-none focus:border-[#1a3826] shadow-xs"
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
          <div className="w-8 h-8 border-3 border-[#1a3826] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="bg-white border border-[#e5dccb] rounded-xl p-12 text-center text-gray-500">
          <FolderOpen size={40} className="mx-auto mb-3 opacity-50" />
          <p className="font-medium text-[#111827]">Aucun projet ne correspond à votre recherche.</p>
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
                className={`bg-white border border-[#e5dccb] rounded-xl overflow-hidden shadow-xs flex flex-col justify-between ${
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
                      <div className="w-full h-full bg-[#1a3826] flex items-center justify-center text-white text-2xl font-bold font-serif-custom">
                        {project.titre.charAt(0)}
                      </div>
                    )}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="bg-[#1a3826] text-white px-2.5 py-0.5 rounded text-xs font-semibold">
                        {project.categorie}
                      </span>
                      {project.mis_en_avant && (
                        <span className="bg-[#b45309] text-white px-2 py-0.5 rounded text-xs font-semibold inline-flex items-center gap-1">
                          <Star size={12} className="fill-white" />
                          Featured
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold font-serif-custom text-[#111827] mb-1.5">
                      {project.titre}
                    </h3>
                    <p className="text-sm text-[#4b5563] line-clamp-2 mb-3">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {techs.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 bg-[#f3ece0] text-[#111827] rounded text-xs font-mono"
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
                <div className="px-5 py-3.5 border-t border-[#e5dccb] bg-[#f7f4ec]/40 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {project.lien_demo && project.lien_demo !== "#" && (
                      <a
                        href={project.lien_demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#1a3826] hover:underline inline-flex items-center gap-1 font-semibold"
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
                      className="p-1.5 rounded text-gray-600 hover:bg-white hover:text-[#b45309] border border-transparent hover:border-[#e5dccb] transition-all"
                    >
                      <Archive size={15} />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(project)}
                      title="Modifier"
                      className="p-1.5 rounded text-gray-700 hover:bg-white hover:text-[#1a3826] border border-transparent hover:border-[#e5dccb] transition-all"
                    >
                      <Edit2 size={15} />
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
          <div className="bg-white border border-[#e5dccb] rounded-2xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#e5dccb] mb-6">
              <h2 className="text-xl font-bold font-serif-custom text-[#111827]">
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
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111827] mb-1.5">
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
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111827] mb-1.5">
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
                <label className="block text-xs font-bold uppercase tracking-wider text-[#111827] mb-1.5">
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
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111827] mb-1.5">
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
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111827] mb-1.5">
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
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111827] mb-1.5">
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
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111827] mb-1.5">
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
                <label className="block text-xs font-bold uppercase tracking-wider text-[#111827] mb-1.5">
                  Image / capture d&apos;écran
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setImageFile(e.target.files?.[0] || null)
                  }
                  className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#f3ece0] file:text-[#1a3826] hover:file:bg-[#e5dccb] cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-sm text-[#111827] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.mis_en_avant}
                    onChange={(e) =>
                      setForm({ ...form, mis_en_avant: e.target.checked })
                    }
                    className="rounded border-[#e5dccb] text-[#1a3826] focus:ring-[#1a3826]"
                  />
                  <span>Mettre en avant (★ Featured)</span>
                </label>
                <label className="flex items-center gap-2 text-sm text-[#111827] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.archive}
                    onChange={(e) =>
                      setForm({ ...form, archive: e.target.checked })
                    }
                    className="rounded border-[#e5dccb] text-[#1a3826] focus:ring-[#1a3826]"
                  />
                  <span>Archiver le projet</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e5dccb]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-white hover:bg-gray-100 text-gray-700 border border-[#e5dccb] text-sm font-semibold rounded-lg transition-all"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-[#1a3826] hover:bg-[#142a1d] disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-all shadow-xs"
                >
                  {submitting
                    ? "Enregistrement..."
                    : editingId
                    ? "Enregistrer les modifications"
                    : "Créer le projet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
