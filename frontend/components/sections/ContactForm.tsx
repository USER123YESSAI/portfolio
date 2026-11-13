"use client";

import { useState } from "react";
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { sendContact } from "@/lib/api";

export default function ContactForm() {
  const [form, setForm] = useState({
    nom: "",
    email: "",
    sujet: "",
    contenu: "",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      await sendContact(form);
      setStatus("success");
      setForm({ nom: "", email: "", sujet: "", contenu: "" });
    } catch (err: unknown) {
      setStatus("error");
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      setErrorMsg(msg || "Une erreur est survenue. Veuillez réessayer.");
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-lg text-sm transition-all outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent";

  const inputStyle = {
    backgroundColor: "var(--bg-subtle)",
    color: "var(--heading-color)",
    border: "1px solid var(--border)",
  };

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="rounded-2xl p-8 sm:p-12 text-center space-y-5 shadow-sm transition-colors duration-300"
        style={{
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: [0, 15, 0] }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center bg-green-500/10 border border-green-500/20 text-green-500 shadow-inner"
        >
          <CheckCircle size={32} />
        </motion.div>
        <h3
          className="text-2xl font-bold font-serif-custom"
          style={{ color: "var(--heading-color)" }}
        >
          Message envoyé avec succès !
        </h3>
        <p
          className="text-sm sm:text-base leading-relaxed max-w-md mx-auto"
          style={{ color: "var(--body-text)" }}
        >
          Merci pour votre message. Je l&apos;ai bien reçu et je vous répondrai
          dans les plus brefs délais.
        </p>
        <div className="pt-2">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            type="button"
            onClick={() => setStatus("idle")}
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg text-sm font-semibold text-white shadow-sm cursor-pointer"
            style={{ backgroundColor: "var(--primary)" }}
          >
            Envoyer un autre message
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      onSubmit={handleSubmit}
      className="rounded-2xl p-6 sm:p-10 space-y-6 shadow-sm transition-colors duration-300"
      style={{
        backgroundColor: "var(--card)",
        border: "1px solid var(--border)",
      }}
    >
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label
            htmlFor="nom"
            className="block text-xs font-bold uppercase tracking-wider mb-2"
            style={{ color: "var(--heading-color)" }}
          >
            Nom complet *
          </label>
          <input
            id="nom"
            type="text"
            required
            value={form.nom}
            onChange={(e) => setForm({ ...form, nom: e.target.value })}
            className={inputClass}
            style={inputStyle}
            placeholder="Votre nom complet"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-bold uppercase tracking-wider mb-2"
            style={{ color: "var(--heading-color)" }}
          >
            Email *
          </label>
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={inputClass}
            style={inputStyle}
            placeholder="vous@exemple.com"
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="sujet"
          className="block text-xs font-bold uppercase tracking-wider mb-2"
          style={{ color: "var(--heading-color)" }}
        >
          Sujet *
        </label>
        <input
          id="sujet"
          type="text"
          required
          value={form.sujet}
          onChange={(e) => setForm({ ...form, sujet: e.target.value })}
          className={inputClass}
          style={inputStyle}
          placeholder="Objet de votre demande"
        />
      </div>
      <div>
        <label
          htmlFor="contenu"
          className="block text-xs font-bold uppercase tracking-wider mb-2"
          style={{ color: "var(--heading-color)" }}
        >
          Message *
        </label>
        <textarea
          id="contenu"
          required
          rows={5}
          value={form.contenu}
          onChange={(e) => setForm({ ...form, contenu: e.target.value })}
          className={`${inputClass} resize-none`}
          style={inputStyle}
          placeholder="Votre message..."
        />
      </div>

      <AnimatePresence>
        {status === "error" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2.5 px-4 py-3 rounded-lg text-sm font-medium bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/30 dark:border-red-700 dark:text-red-400"
          >
            <AlertCircle size={18} className="shrink-0" />
            <span>{errorMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={status === "loading"}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 text-white font-semibold text-sm rounded-lg shadow-sm transition-all disabled:opacity-50 cursor-pointer"
        style={{ backgroundColor: "var(--primary)" }}
      >
        {status === "loading" ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>Envoi...</span>
          </>
        ) : (
          <>
            <Send size={16} />
            <span>Envoyer le message</span>
          </>
        )}
      </motion.button>
    </motion.form>
  );
}
