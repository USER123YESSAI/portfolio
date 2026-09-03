"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, CheckCircle, AlertCircle, X } from "lucide-react";
import {
  adminGetSkills,
  adminCreateSkill,
  adminUpdateSkill,
  adminDeleteSkill,
} from "@/lib/api";
import type { Skill } from "@/types";

const categories = [
  { key: "langages", label: "< > Langages" },
  { key: "frameworks", label: "{ } Frameworks & Libs" },
  { key: "outils", label: "⚙ Outils & Méthodes" },
  { key: "soft_skills", label: "👤 Soft Skills" },
];

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    nom: "",
    niveau: 80,
    categorie: "langages",
    icone: "",
  });
  const [statusMsg, setStatusMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const data = await adminGetSkills();
      setSkills(data);
    } catch {
      setStatusMsg({
        type: "error",
        text: "Erreur lors du chargement des compétences.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setForm({ nom: "", niveau: 80, categorie: "langages", icone: "" });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (skill: Skill) => {
    setEditingId(skill.id);
    setForm({
      nom: skill.nom,
      niveau: skill.niveau || 80,
      categorie: skill.categorie || "langages",
      icone: skill.icone || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMsg(null);

    try {
      if (editingId) {
        await adminUpdateSkill(editingId, form);
        setStatusMsg({
          type: "success",
          text: "Compétence mise à jour.",
        });
      } else {
        await adminCreateSkill(form);
        setStatusMsg({
          type: "success",
          text: "Compétence créée.",
        });
      }
      setIsModalOpen(false);
      fetchSkills();
    } catch {
      setStatusMsg({
        type: "error",
        text: "Erreur lors de l'enregistrement.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette compétence ?"))
      return;
    try {
      await adminDeleteSkill(id);
      setStatusMsg({ type: "success", text: "Compétence supprimée." });
      setSkills((prev) => prev.filter((s) => s.id !== id));
    } catch {
      setStatusMsg({
        type: "error",
        text: "Erreur lors de la suppression.",
      });
    }
  };

  const inputClass =
    "w-full px-3.5 py-2.5 bg-white border border-[#e5dccb] rounded-lg text-sm text-[#111827] placeholder:text-gray-400 focus:outline-none focus:border-[#1a3826] transition-all";

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif-custom text-[#111827]">
            Gestion des Compétences
          </h1>
          <p className="text-[#4b5563] text-sm mt-1">
            Ajoutez, modifiez ou organisez vos compétences par catégorie ({skills.length} compétence{skills.length > 1 ? "s" : ""}).
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1a3826] hover:bg-[#142a1d] text-white text-sm font-semibold rounded-lg transition-all shadow-xs"
        >
          <Plus size={18} />
          <span>Nouvelle Compétence</span>
        </button>
      </div>

      {/* Status Msg */}
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

      {/* Skills Grouped by Category */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-3 border-[#1a3826] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {categories.map(({ key, label }) => {
            const catSkills = skills.filter(
              (s) => (s.categorie || "outils") === key
            );
            return (
              <div
                key={key}
                className="bg-white border border-[#e5dccb] rounded-xl p-6 shadow-xs flex flex-col"
              >
                <div className="flex items-center justify-between pb-4 border-b border-[#e5dccb] mb-4">
                  <span className="bg-[#1a3826] text-white px-3 py-1 rounded-md text-xs font-semibold font-mono">
                    {label}
                  </span>
                  <span className="text-xs text-gray-500 font-semibold">
                    {catSkills.length} compétence{catSkills.length > 1 ? "s" : ""}
                  </span>
                </div>

                <div className="space-y-4 flex-1">
                  {catSkills.length === 0 ? (
                    <p className="text-xs text-gray-400 italic py-4 text-center">
                      Aucune compétence dans cette catégorie
                    </p>
                  ) : (
                    catSkills.map((skill) => (
                      <div
                        key={skill.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-[#f7f4ec]/50 border border-[#e5dccb]/60 hover:border-[#e5dccb] transition-all"
                      >
                        <div className="flex-1 mr-4">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-sm font-bold text-[#111827]">
                              {skill.nom}
                            </span>
                            <span className="text-xs font-mono font-semibold text-gray-500">
                              {skill.niveau}%
                            </span>
                          </div>
                          <div className="h-1.5 bg-[#e5dccb] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#1a3826] rounded-full"
                              style={{ width: `${skill.niveau}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleOpenEdit(skill)}
                            className="p-1.5 rounded text-gray-600 hover:bg-white hover:text-[#1a3826] transition-all"
                            title="Modifier"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(skill.id)}
                            className="p-1.5 rounded text-red-600 hover:bg-red-50 transition-all"
                            title="Supprimer"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal / Formulaire */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white border border-[#e5dccb] rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#e5dccb] mb-6">
              <h2 className="text-xl font-bold font-serif-custom text-[#111827]">
                {editingId
                  ? "Modifier la compétence"
                  : "Nouvelle compétence"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#111827] mb-1.5">
                  Nom de la compétence *
                </label>
                <input
                  type="text"
                  required
                  value={form.nom}
                  onChange={(e) => setForm({ ...form, nom: e.target.value })}
                  className={inputClass}
                  placeholder="ex: React, TypeScript, Docker..."
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
                  {categories.map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#111827] mb-1.5">
                  Niveau de maîtrise (0 à 100%) :{" "}
                  <span className="font-mono text-[#1a3826]">
                    {form.niveau}%
                  </span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={form.niveau}
                  onChange={(e) =>
                    setForm({ ...form, niveau: Number(e.target.value) })
                  }
                  className="w-full accent-[#1a3826] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e5dccb]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-white hover:bg-gray-100 text-gray-700 border border-[#e5dccb] text-sm font-semibold rounded-lg transition-all"
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
                    ? "Modifier"
                    : "Créer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
