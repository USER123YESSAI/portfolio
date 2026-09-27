"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  CheckCircle,
  AlertCircle,
  X,
  GraduationCap,
  Check,
  Loader2,
} from "lucide-react";
import {
  adminGetEducations,
  adminCreateEducation,
  adminUpdateEducation,
  adminDeleteEducation,
} from "@/lib/api";
import { formatDate } from "@/lib/utils";
import type { Education } from "@/types";

export default function AdminEducationsPage() {
  const [educations, setEducations] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    intitule: "",
    etablissement: "",
    description: "",
    date_debut: "",
    date_fin: "",
  });
  const [statusMsg, setStatusMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchEducations = async () => {
    setLoading(true);
    try {
      const data = await adminGetEducations();
      setEducations(data);
    } catch {
      setStatusMsg({
        type: "error",
        text: "Erreur lors du chargement des formations.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducations();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setForm({
      intitule: "",
      etablissement: "",
      description: "",
      date_debut: "",
      date_fin: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (edu: Education) => {
    setEditingId(edu.id);
    setForm({
      intitule: edu.intitule,
      etablissement: edu.etablissement,
      description: edu.description || "",
      date_debut: edu.date_debut ? edu.date_debut.split("T")[0] : "",
      date_fin: edu.date_fin ? edu.date_fin.split("T")[0] : "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMsg(null);

    try {
      if (editingId) {
        await adminUpdateEducation(editingId, form);
        setStatusMsg({
          type: "success",
          text: "Formation modifiée avec succès.",
        });
      } else {
        await adminCreateEducation(form);
        setStatusMsg({
          type: "success",
          text: "Formation ajoutée avec succès.",
        });
      }
      setIsModalOpen(false);
      fetchEducations();
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
    if (!window.confirm("Supprimer cette formation académique ?")) return;
    try {
      await adminDeleteEducation(id);
      setStatusMsg({ type: "success", text: "Formation supprimée." });
      setEducations((prev) => prev.filter((e) => e.id !== id));
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif-custom text-[#111827]">
            Formations Académiques
          </h1>
          <p className="text-[#4b5563] text-sm mt-1">
            Gérez vos diplômes, universités et cursus ({educations.length} formation{educations.length > 1 ? "s" : ""}).
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1a3826] hover:bg-[#142a1d] text-white text-sm font-semibold rounded-lg transition-all shadow-xs"
        >
          <Plus size={18} />
          <span>Nouvelle Formation</span>
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

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-3 border-[#1a3826] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : educations.length === 0 ? (
        <div className="bg-white border border-[#e5dccb] rounded-xl p-12 text-center text-gray-500">
          <GraduationCap size={40} className="mx-auto mb-3 opacity-40" />
          <p className="font-medium text-[#111827]">Aucune formation académique enregistrée.</p>
        </div>
      ) : (
        <div className="bg-white border border-[#e5dccb] rounded-xl overflow-hidden shadow-xs">
          <div className="divide-y divide-[#e5dccb]">
            {educations.map((edu) => (
              <div
                key={edu.id}
                className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#faf7f0] transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2.5 mb-1">
                    <span className="text-xs px-2.5 py-0.5 rounded-md font-semibold font-mono bg-[#b45309] text-white">
                      Formation
                    </span>
                    <span className="text-xs font-mono text-gray-500 font-semibold">
                      {formatDate(edu.date_debut)} — {formatDate(edu.date_fin)}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold font-serif-custom text-[#111827]">
                    {edu.intitule}
                  </h3>
                  <p className="text-[#b45309] text-sm font-semibold">
                    {edu.etablissement}
                  </p>
                  {edu.description && (
                    <p className="text-sm text-[#4b5563] mt-2 max-w-2xl leading-relaxed">
                      {edu.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleOpenEdit(edu)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-700 bg-white border border-[#e5dccb] hover:bg-gray-50 inline-flex items-center gap-1.5 transition-all"
                  >
                    <Pencil size={13} />
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(edu.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 bg-white border border-red-200 hover:bg-red-50 inline-flex items-center gap-1.5 transition-all"
                  >
                    <Trash2 size={13} />
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal / Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white border border-[#e5dccb] rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#e5dccb] mb-6">
              <h2 className="text-xl font-bold font-serif-custom text-[#111827]">
                {editingId
                  ? "Modifier la formation"
                  : "Nouvelle formation"}
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
                  Intitulé du Diplôme / Cursus *
                </label>
                <input
                  type="text"
                  required
                  value={form.intitule}
                  onChange={(e) =>
                    setForm({ ...form, intitule: e.target.value })
                  }
                  className={inputClass}
                  placeholder="ex: Bachelor CSI (Conception de Systèmes d'Information)"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#111827] mb-1.5">
                  Établissement / École *
                </label>
                <input
                  type="text"
                  required
                  value={form.etablissement}
                  onChange={(e) =>
                    setForm({ ...form, etablissement: e.target.value })
                  }
                  className={inputClass}
                  placeholder="ex: EPF Africa, Dakar"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111827] mb-1.5">
                    Date de début *
                  </label>
                  <input
                    type="date"
                    required
                    value={form.date_debut}
                    onChange={(e) =>
                      setForm({ ...form, date_debut: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111827] mb-1.5">
                    Date de fin (ou date prévue) *
                  </label>
                  <input
                    type="date"
                    required
                    value={form.date_fin}
                    onChange={(e) =>
                      setForm({ ...form, date_fin: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#111827] mb-1.5">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className={`${inputClass} resize-none`}
                  placeholder="Détails du programme, mentions, majeures suivies..."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e5dccb]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-gray-100 text-gray-700 border border-[#e5dccb] text-sm font-semibold rounded-lg transition-all"
                >
                  <X size={15} />
                  <span>Annuler</span>
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1a3826] hover:bg-[#142a1d] disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-all shadow-xs"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Enregistrement...</span>
                    </>
                  ) : editingId ? (
                    <>
                      <Check size={16} />
                      <span>Modifier</span>
                    </>
                  ) : (
                    <>
                      <Plus size={16} />
                      <span>Créer</span>
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
