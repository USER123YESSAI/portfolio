"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Lock, X, AlertCircle, Loader2 } from "lucide-react";
import { verifyCVPassword, downloadCV } from "@/lib/api";

interface CVPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CVPasswordModal({
  isOpen,
  onClose,
}: CVPasswordModalProps) {
  const [mounted, setMounted] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset and focus when opening, lock background scroll
  useEffect(() => {
    if (isOpen) {
      setPassword("");
      setError(null);
      setLoading(false);
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError("Veuillez saisir le mot de passe.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await verifyCVPassword(password.trim());
      // Password is valid -> trigger protected download
      downloadCV(password.trim());
      onClose();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Mot de passe incorrect.";
      setError(msg);
      inputRef.current?.focus();
    } finally {
      setLoading(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop (click to close) */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Centered Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cv-modal-title"
        className="relative z-10 w-full max-w-sm my-auto rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#233559] bg-[#0c1427] text-white animate-in zoom-in-95 fade-in duration-200"
      >
        {/* Close Button Top Right */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-xl bg-[#6366f1] hover:bg-[#4f46e5] text-white transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-[#818cf8] cursor-pointer"
          aria-label="Fermer la fenêtre"
          title="Fermer (Échap)"
        >
          <X size={18} />
        </button>

        {/* Lock Icon Center */}
        <div className="flex justify-center pt-1 pb-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white">
            <Lock size={32} strokeWidth={2.2} />
          </div>
        </div>

        {/* Title */}
        <h2
          id="cv-modal-title"
          className="text-2xl font-bold text-center text-white tracking-tight mb-2"
        >
          Accès au CV
        </h2>

        {/* Subtitle */}
        <p className="text-sm text-gray-300 text-center leading-relaxed mb-6 px-1">
          Entrez le mot de passe pour télécharger le CV.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              ref={inputRef}
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Mot de passe"
              disabled={loading}
              className="w-full px-4 py-3.5 rounded-xl bg-[#15213b] border border-[#23355a] text-white placeholder:text-gray-400 text-sm focus:outline-none focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/30 transition-all shadow-inner"
            />

            {error && (
              <div className="flex items-center justify-center gap-1.5 mt-2.5 text-xs font-semibold text-red-400 animate-in fade-in">
                <AlertCircle size={14} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-[#6366f1] hover:bg-[#4f46e5] active:scale-[0.99] disabled:opacity-50 text-white font-bold text-base shadow-lg shadow-[#6366f1]/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Vérification...</span>
              </>
            ) : (
              <span>Télécharger</span>
            )}
          </button>

          {/* Cancel button */}
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors text-center cursor-pointer"
          >
            Annuler et fermer
          </button>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
