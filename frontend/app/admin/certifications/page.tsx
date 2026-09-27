"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  CheckCircle,
  AlertCircle,
  X,
  Award,
  ExternalLink,
  Check,
  Loader2,
} from "lucide-react";
import {
  adminGetCertifications,
  adminCreateCertification,
  adminUpdateCertification,
  adminDeleteCertification,
} from "@/lib/api";
import { formatDate } from "@/lib/utils";
import type { Certification } from "@/types";

export default function AdminCertificationsPage() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    nom: "",
    organisme: "",
    date_obtention: "",
    lien_justificatif: "",
  });
  const [statusMsg, setStatusMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchCertifications = async () => {
    setLoading(true);
    try {
      const data = await adminGetCertifications();
      setCertifications(data);
    } catch {
      setStatusMsg({
        type: "error",
        text: "Erreur lors du chargement des certifications.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertifications();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setForm({
      nom: "",
      organisme: "",
      date_obtention: "",
      lien_justificatif: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cert: Certification) => {
    setEditingId(cert.id);
    setForm({
      nom: cert.nom,
      organisme: cert.organisme,
      date_obtention: cert.date_obtention
        ? cert.date_obtention.split("T")[0]
        : "",
      lien_justificatif: cert.lien_justificatif || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMsg(null);

    try {
      if (editingId) {
        await adminUpdateCertification(editingId, form);
        setStatusMsg({
          type: "success",
          text: "Certification modifiée avec succès.",
        });
      } else {
        await adminCreateCertification(form);
        setStatusMsg({
          type: "success",
          text: "Certification ajoutée avec succès.",
        });
      }
      setIsModalOpen(false);
      fetchCertifications();
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
    if (!window.confirm("Supprimer cette certification ?")) return;
    try {
      await adminDeleteCertification(id);
      setStatusMsg({ type: "success", text: "Certification supprimée." });
      setCertifications((prev) => prev.filter((c) => c.id !== id));
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
            Certifications & Diplômes
          </h1>
          <p className="text-[#4b5563] text-sm mt-1">
            Gérez vos certifications, agréments et justificatifs en ligne ({certifications.length} certification{certifications.length > 1 ? "s" : ""}).
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1a3826] hover:bg-[#142a1d] text-white text-sm font-semibold rounded-lg transition-all shadow-xs"
        >
          <Plus size={18} />
          <span>Nouvelle Certification</span>
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
      ) : certifications.length === 0 ? (
        <div className="bg-white border border-[#e5dccb] rounded-xl p-12 text-center text-gray-500">
          <Award size={40} className="mx-auto mb-3 opacity-40" />
          <p className="font-medium text-[#111827]">Aucune certification enregistrée.</p>
        </div>
      ) : (
        <div className="bg-white border border-[#e5dccb] rounded-xl overflow-hidden shadow-xs">
          <div className="divide-y divide-[#e5dccb]">
            {certifications.map((cert) => (
              <div
                key={cert.id}
                className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#faf7f0] transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2.5 mb-1">
                    <span className="text-xs px-2.5 py-0.5 rounded-md font-semibold font-mono bg-gray-800 text-white">
                      Certification
                    </span>
                    <span className="text-xs font-mono text-gray-500 font-semibold">
                      {formatDate(cert.date_obtention)}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold font-serif-custom text-[#111827]">
                    {cert.nom}
                  </h3>
                  <p className="text-[#b45309] text-sm font-semibold">
                    {cert.organisme}
                  </p>
                  {cert.lien_justificatif && cert.lien_justificatif !== "#" && (
                    <a
                      href={cert.lien_justificatif}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1a3826] hover:underline mt-2"
                    >
                      <span>Voir le justificatif</span>
                      <ExternalLink size={13} />
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleOpenEdit(cert)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-700 bg-white border border-[#e5dccb] hover:bg-gray-50 inline-flex items-center gap-1.5 transition-all"
                  >
                    <Pencil size={13} />
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(cert.id)}
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
                  ? "Modifier la certification"
                  : "Nouvelle certification"}
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
                  Nom de la Certification *
                </label>
                <input
                  type="text"
                  required
                  value={form.nom}
                  onChange={(e) =>
                    setForm({ ...form, nom: e.target.value })
                  }
                  className={inputClass}
                  placeholder="ex: AWS Certified Developer, TOEFL..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#111827] mb-1.5">
                  Organisme certificateur *
                </label>
                <input
                  type="text"
                  required
                  value={form.organisme}
                  onChange={(e) =>
                    setForm({ ...form, organisme: e.target.value })
                  }
                  className={inputClass}
                  placeholder="ex: Amazon Web Services, ETS..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#111827] mb-1.5">
                  Date d&apos;obtention *
                </label>
                <input
                  type="date"
                  required
                  value={form.date_obtention}
                  onChange={(e) =>
                    setForm({ ...form, date_obtention: e.target.value })
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#111827] mb-1.5">
                  Lien vers le justificatif / badge (URL)
                </label>
                <input
                  type="url"
                  value={form.lien_justificatif}
                  onChange={(e) =>
                    setForm({ ...form, lien_justificatif: e.target.value })
                  }
                  className={inputClass}
                  placeholder="https://credly.com/badge/..."
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
