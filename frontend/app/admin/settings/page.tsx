"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Save,
  Upload,
  FileText,
  AlertCircle,
  CheckCircle,
  User,
  Globe,
  Share2,
  Sparkles,
  Trash2,
  Loader2,
} from "lucide-react";
import {
  adminGetSettings,
  adminUpdateSettings,
  uploadProfileImage,
  uploadAboutPhoto,
  uploadCV,
  getAssetUrl,
} from "@/lib/api";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<{
    site_title: string;
    site_description: string;
    hero_title: string;
    hero_subtitle: string;
    bio: string;
    career_goal: string;
    email: string;
    phone: string;
    location: string;
    profile_photo?: string;
    cv_path?: string;
    cv_password?: string;
    about_title?: string;
    about_text?: string;
    about_photo?: string;
    about_languages?: string;
    social_links: {
      github: string;
      linkedin: string;
      twitter: string;
    };
  }>({
    site_title: "",
    site_description: "",
    hero_title: "",
    hero_subtitle: "",
    bio: "",
    career_goal: "",
    email: "",
    phone: "",
    location: "",
    profile_photo: "",
    cv_path: "",
    cv_password: "",
    about_title: "",
    about_text: "",
    about_photo: "",
    about_languages: "",
    social_links: {
      github: "",
      linkedin: "",
      twitter: "",
    },
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Upload states
  const [photoUploading, setPhotoUploading] = useState(false);
  const [aboutPhotoUploading, setAboutPhotoUploading] = useState(false);
  const [cvUploading, setCvUploading] = useState(false);

  useEffect(() => {
    adminGetSettings()
      .then((data) => {
        setSettings({
          ...data,
          social_links: data.social_links || {
            github: "",
            linkedin: "",
            twitter: "",
          },
        });
      })
      .catch(() => {
        setStatusMsg({
          type: "error",
          text: "Erreur lors du chargement des paramètres.",
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMsg(null);
    try {
      await adminUpdateSettings(settings);
      setStatusMsg({
        type: "success",
        text: "Paramètres mis à jour avec succès !",
      });
    } catch {
      setStatusMsg({
        type: "error",
        text: "Erreur lors de la sauvegarde des paramètres.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoUploading(true);
    setStatusMsg(null);
    try {
      const res = await uploadProfileImage(file);
      setSettings((prev) => ({ ...prev, profile_photo: res.profile_photo }));
      setStatusMsg({
        type: "success",
        text: "Photo de profil mise à jour avec succès !",
      });
    } catch {
      setStatusMsg({
        type: "error",
        text: "Erreur lors de l'upload de la photo.",
      });
    } finally {
      setPhotoUploading(false);
    }
  };

  const handleAboutPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAboutPhotoUploading(true);
    setStatusMsg(null);
    try {
      const res = await uploadAboutPhoto(file);
      setSettings((prev) => ({ ...prev, about_photo: res.about_photo }));
      setStatusMsg({
        type: "success",
        text: "Photo de la section À propos mise à jour avec succès !",
      });
    } catch {
      setStatusMsg({
        type: "error",
        text: "Erreur lors de l'upload de la photo À propos.",
      });
    } finally {
      setAboutPhotoUploading(false);
    }
  };

  const handleCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCvUploading(true);
    setStatusMsg(null);
    try {
      const res = await uploadCV(file);
      setSettings((prev) => ({ ...prev, cv_path: res.cv_path }));
      setStatusMsg({
        type: "success",
        text: "Fichier CV (PDF) mis à jour avec succès !",
      });
    } catch {
      setStatusMsg({
        type: "error",
        text: "Erreur lors de l'upload du CV.",
      });
    } finally {
      setCvUploading(false);
    }
  };

  const photoUrl = getAssetUrl(settings.profile_photo);
  const aboutPhotoUrl = getAssetUrl(settings.about_photo || settings.profile_photo);

  const inputClass =
    "w-full px-3.5 py-2.5 bg-white border border-[#e5dccb] rounded-lg text-sm text-[#111827] placeholder:text-gray-400 focus:outline-none focus:border-[#1a3826] transition-all";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-serif-custom text-[#111827]">
          Paramètres Généraux
        </h1>
        <p className="text-[#4b5563] text-sm mt-1">
          Personnalisez votre identité, vos textes, votre section À propos et vos photos.
        </p>
      </div>

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

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-[3px] border-[#1a3826] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Main Form (2 columns) */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
            {/* Section 1 : Site SEO & Title */}
            <div className="bg-white border border-[#e5dccb] rounded-xl p-6 sm:p-8 space-y-4 shadow-xs">
              <div className="flex items-center gap-2 border-b border-[#e5dccb] pb-3 text-[#111827]">
                <Globe size={18} className="text-[#1a3826]" />
                <h2 className="font-bold text-lg font-serif-custom">
                  Identité du site (SEO)
                </h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111827] mb-1.5">
                    Titre du Site (balise Title)
                  </label>
                  <input
                    type="text"
                    value={settings.site_title || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, site_title: e.target.value })
                    }
                    className={inputClass}
                    placeholder="ex: Portfolio — Yessaïn Nanadoumadji"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111827] mb-1.5">
                    Description SEO
                  </label>
                  <input
                    type="text"
                    value={settings.site_description || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        site_description: e.target.value,
                      })
                    }
                    className={inputClass}
                    placeholder="ex: Portfolio professionnel, projets et compétences."
                  />
                </div>
              </div>
            </div>

            {/* Section 2 : Page d'Accueil & Bio */}
            <div className="bg-white border border-[#e5dccb] rounded-xl p-6 sm:p-8 space-y-4 shadow-xs">
              <div className="flex items-center gap-2 border-b border-[#e5dccb] pb-3 text-[#111827]">
                <User size={18} className="text-[#1a3826]" />
                <h2 className="font-bold text-lg font-serif-custom">
                  Page d&apos;Accueil & Bio Hero
                </h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111827] mb-1.5">
                    Sous-titre Hero
                  </label>
                  <input
                    type="text"
                    value={settings.hero_title || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, hero_title: e.target.value })
                    }
                    className={inputClass}
                    placeholder="ex: Développeur Full-Stack"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111827] mb-1.5">
                    Localisation
                  </label>
                  <input
                    type="text"
                    value={settings.location || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, location: e.target.value })
                    }
                    className={inputClass}
                    placeholder="ex: Dakar, Sénégal"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#111827] mb-1.5">
                  Biographie principale (Hero)
                </label>
                <textarea
                  rows={3}
                  value={settings.bio || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, bio: e.target.value })
                  }
                  className={`${inputClass} resize-none`}
                  placeholder="Présentez brièvement votre parcours et vos compétences..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#111827] mb-1.5">
                  Objectif professionnel / Citation (affiché en bas de l&apos;accueil)
                </label>
                <input
                  type="text"
                  value={settings.career_goal || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, career_goal: e.target.value })
                  }
                  className={inputClass}
                  placeholder="ex: Recherche un stage de 6 mois en développement web..."
                />
              </div>
            </div>

            {/* Section 3 : Section À Propos */}
            <div className="bg-white border border-[#e5dccb] rounded-xl p-6 sm:p-8 space-y-4 shadow-xs">
              <div className="flex items-center gap-2 border-b border-[#e5dccb] pb-3 text-[#111827]">
                <Sparkles size={18} className="text-[#1a3826]" />
                <h2 className="font-bold text-lg font-serif-custom">
                  Section &quot;À Propos&quot;
                </h2>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#111827] mb-1.5">
                  Titre d&apos;accroche
                </label>
                <input
                  type="text"
                  value={settings.about_title || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, about_title: e.target.value })
                  }
                  className={inputClass}
                  placeholder="ex: Un profil full stack ancré dans le concret."
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#111827] mb-1.5">
                  Texte de présentation détaillé
                </label>
                <textarea
                  rows={4}
                  value={settings.about_text || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, about_text: e.target.value })
                  }
                  className={`${inputClass} resize-none`}
                  placeholder="ex: Étudiant en Bachelor CSI 3 à l'EPF Africa Dakar, je conçois et développe des interfaces React soignées..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#111827] mb-1.5">
                  Langues maîtrisées
                </label>
                <input
                  type="text"
                  value={settings.about_languages || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, about_languages: e.target.value })
                  }
                  className={inputClass}
                  placeholder="ex: Français (langue maternelle), Anglais technique"
                />
              </div>
            </div>

            {/* Section 4 : Coordonnées & Réseaux Sociaux */}
            <div className="bg-white border border-[#e5dccb] rounded-xl p-6 sm:p-8 space-y-4 shadow-xs">
              <div className="flex items-center gap-2 border-b border-[#e5dccb] pb-3 text-[#111827]">
                <Share2 size={18} className="text-[#1a3826]" />
                <h2 className="font-bold text-lg font-serif-custom">
                  Coordonnées & Réseaux Sociaux
                </h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111827] mb-1.5">
                    Email de contact
                  </label>
                  <input
                    type="email"
                    value={settings.email || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, email: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111827] mb-1.5">
                    Téléphone
                  </label>
                  <input
                    type="text"
                    value={settings.phone || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, phone: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111827] mb-1.5">
                    Lien GitHub
                  </label>
                  <input
                    type="url"
                    value={settings.social_links?.github || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        social_links: {
                          ...settings.social_links,
                          github: e.target.value,
                        },
                      })
                    }
                    className={inputClass}
                    placeholder="https://github.com/votre-compte"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111827] mb-1.5">
                    Lien LinkedIn
                  </label>
                  <input
                    type="url"
                    value={settings.social_links?.linkedin || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        social_links: {
                          ...settings.social_links,
                          linkedin: e.target.value,
                        },
                      })
                    }
                    className={inputClass}
                    placeholder="https://linkedin.com/in/votre-profil"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-8 py-3 bg-[#1a3826] hover:bg-[#142a1d] disabled:opacity-50 text-white font-semibold text-sm rounded-lg shadow-sm transition-all"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Enregistrement en cours...</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>Enregistrer tous les paramètres</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Right Column : Photos and CV Files */}
          <div className="space-y-6">
            {/* Profile Photo */}
            <div className="bg-white border border-[#e5dccb] rounded-xl p-6 space-y-4 shadow-xs text-center">
              <h3 className="font-bold text-base font-serif-custom text-[#111827] border-b border-[#e5dccb] pb-3">
                Photo de Profil (Hero)
              </h3>
              <div className="flex justify-center py-2">
                <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-[#e5dccb] bg-[#f3ece0]">
                  {photoUrl ? (
                    <Image
                      src={photoUrl}
                      alt="Profil"
                      fill
                      className="object-cover"
                      sizes="112px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl font-bold font-serif-custom text-[#1a3826]">
                      YN
                    </div>
                  )}
                </div>
              </div>
              <label className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-[#111827] border border-[#e5dccb] text-xs font-semibold rounded-lg cursor-pointer transition-all w-full shadow-xs">
                {photoUploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                <span>
                  {photoUploading ? "Upload en cours..." : "Changer la photo"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  disabled={photoUploading}
                  className="hidden"
                />
              </label>
              <p className="text-[11px] text-gray-500">
                Format PNG, JPG ou WEBP. Taille max : 5 MB.
              </p>
            </div>

            {/* About Photo */}
            <div className="bg-white border border-[#e5dccb] rounded-xl p-6 space-y-4 shadow-xs text-center">
              <h3 className="font-bold text-base font-serif-custom text-[#111827] border-b border-[#e5dccb] pb-3">
                Photo Section &quot;À Propos&quot;
              </h3>
              <div className="flex justify-center py-2">
                <div className="relative w-28 h-36 rounded-2xl overflow-hidden border-2 border-[#e5dccb] bg-[#f3ece0]">
                  {aboutPhotoUrl ? (
                    <Image
                      src={aboutPhotoUrl}
                      alt="À propos"
                      fill
                      className="object-cover"
                      sizes="112px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-bold font-serif-custom text-[#1a3826]">
                      YN
                    </div>
                  )}
                </div>
              </div>
              <label className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-[#111827] border border-[#e5dccb] text-xs font-semibold rounded-lg cursor-pointer transition-all w-full shadow-xs">
                {aboutPhotoUploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                <span>
                  {aboutPhotoUploading ? "Upload en cours..." : "Changer la photo À propos"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAboutPhotoUpload}
                  disabled={aboutPhotoUploading}
                  className="hidden"
                />
              </label>
              {settings.about_photo && (
                <button
                  type="button"
                  onClick={async () => {
                    setSettings((prev) => ({ ...prev, about_photo: "" }));
                    await adminUpdateSettings({ ...settings, about_photo: "" });
                    setStatusMsg({
                      type: "success",
                      text: "Photo spécifique supprimée (la photo de profil sera réutilisée).",
                    });
                  }}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-200 transition-all w-full"
                >
                  <Trash2 size={13} />
                  <span>Réinitialiser à la photo de profil</span>
                </button>
              )}
              <p className="text-[11px] text-gray-500">
                Laisse vide pour réutiliser automatiquement la photo de profil.
              </p>
            </div>

            {/* CV PDF Upload */}
            <div className="bg-white border border-[#e5dccb] rounded-xl p-6 space-y-4 shadow-xs">
              <h3 className="font-bold text-base font-serif-custom text-[#111827] border-b border-[#e5dccb] pb-3">
                CV (Format PDF)
              </h3>
              <div className="flex items-center gap-3 p-3 bg-[#f7f4ec] rounded-lg border border-[#e5dccb]">
                <FileText size={24} className="text-[#1a3826] shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-[#111827] truncate">
                    {settings.cv_path
                      ? "CV enregistré"
                      : "Aucun CV uploadé"}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    Document PDF téléchargeable depuis l&apos;en-tête.
                  </p>
                </div>
              </div>
              <label className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#1a3826] hover:bg-[#142a1d] text-white text-xs font-semibold rounded-lg cursor-pointer transition-all w-full shadow-xs">
                {cvUploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                <span>
                  {cvUploading ? "Upload du CV..." : "Uploader un nouveau CV"}
                </span>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleCVUpload}
                  disabled={cvUploading}
                  className="hidden"
                />
              </label>

              {/* CV Protection Password */}
              <div className="pt-3 border-t border-[#e5dccb] space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#111827]">
                  Mot de passe d&apos;accès au CV
                </label>
                <input
                  type="text"
                  value={settings.cv_password || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, cv_password: e.target.value })
                  }
                  className={inputClass}
                  placeholder="ex: 2026 ou Secret123"
                />
                <p className="text-[11px] text-gray-500">
                  Protège le téléchargement du CV par un mot de passe. N&apos;oubliez pas de cliquer sur &quot;Enregistrer tous les paramètres&quot;.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
