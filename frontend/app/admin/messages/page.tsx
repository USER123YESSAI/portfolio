"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Mail,
  MailOpen,
  Trash2,
  AlertCircle,
  CheckCircle,
  Search,
  MailX,
  ExternalLink,
} from "lucide-react";
import {
  adminGetMessages,
  adminMarkMessageRead,
  adminDeleteMessage,
} from "@/lib/api";
import { formatDate } from "@/lib/utils";
import type { Message } from "@/types";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRead, setFilterRead] = useState<"all" | "unread" | "read">(
    "all"
  );
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(
    null
  );
  const [statusMsg, setStatusMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminGetMessages();
      setMessages(data);
      if (data.length > 0 && !selectedMessage) {
        setSelectedMessage(data[0]);
      }
    } catch {
      setStatusMsg({
        type: "error",
        text: "Erreur lors du chargement des messages.",
      });
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleSelectMessage = async (msg: Message) => {
    setSelectedMessage(msg);
    if (!msg.statut_lu) {
      try {
        await adminMarkMessageRead(msg.id);
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, statut_lu: true } : m))
        );
        setSelectedMessage({ ...msg, statut_lu: true });
      } catch {
        // Ignorer silencieusement
      }
    }
  };

  const handleToggleRead = async (msg: Message, read: boolean) => {
    try {
      await adminMarkMessageRead(msg.id);
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, statut_lu: read } : m))
      );
      if (selectedMessage?.id === msg.id) {
        setSelectedMessage({ ...selectedMessage, statut_lu: read });
      }
    } catch {
      setStatusMsg({
        type: "error",
        text: "Erreur lors de la mise à jour du statut.",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Supprimer définitivement ce message ?")) return;
    try {
      await adminDeleteMessage(id);
      setStatusMsg({ type: "success", text: "Message supprimé." });
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selectedMessage?.id === id) {
        const remaining = messages.filter((m) => m.id !== id);
        setSelectedMessage(remaining.length > 0 ? remaining[0] : null);
      }
    } catch {
      setStatusMsg({
        type: "error",
        text: "Erreur lors de la suppression.",
      });
    }
  };

  const filteredMessages = messages.filter((m) => {
    if (filterRead === "unread" && m.statut_lu) return false;
    if (filterRead === "read" && !m.statut_lu) return false;
    if (
      search &&
      !m.nom.toLowerCase().includes(search.toLowerCase()) &&
      !m.email.toLowerCase().includes(search.toLowerCase()) &&
      !m.sujet.toLowerCase().includes(search.toLowerCase()) &&
      !m.contenu.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  const unreadCount = messages.filter((m) => !m.statut_lu).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif-custom text-[#111827]">
            Messagerie / Contact
          </h1>
          <p className="text-[#4b5563] text-sm mt-1">
            Consultez et gérez les messages envoyés par les recruteurs et visiteurs ({messages.length} message{messages.length > 1 ? "s" : ""}, {unreadCount} non lu{unreadCount > 1 ? "s" : ""}).
          </p>
        </div>
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

      {/* Search and Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, email ou contenu..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#e5dccb] rounded-lg text-sm text-[#111827] placeholder:text-gray-400 focus:outline-none focus:border-[#1a3826] transition-all shadow-xs"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setFilterRead("all")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              filterRead === "all"
                ? "bg-[#1a3826] text-white shadow-xs"
                : "bg-white border border-[#e5dccb] text-gray-700 hover:bg-gray-100"
            }`}
          >
            Tous ({messages.length})
          </button>
          <button
            onClick={() => setFilterRead("unread")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              filterRead === "unread"
                ? "bg-[#1a3826] text-white shadow-xs"
                : "bg-white border border-[#e5dccb] text-gray-700 hover:bg-gray-100"
            }`}
          >
            Non lus ({unreadCount})
          </button>
          <button
            onClick={() => setFilterRead("read")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              filterRead === "read"
                ? "bg-[#1a3826] text-white shadow-xs"
                : "bg-white border border-[#e5dccb] text-gray-700 hover:bg-gray-100"
            }`}
          >
            Lus ({messages.length - unreadCount})
          </button>
        </div>
      </div>

      {/* Inbox Split View */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-3 border-[#1a3826] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="bg-white border border-[#e5dccb] rounded-xl p-12 text-center text-gray-500">
          <MailX size={40} className="mx-auto mb-3 opacity-40" />
          <p className="font-medium text-[#111827]">Aucun message trouvé.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-12 gap-6">
          {/* List column (5 cols) */}
          <div className="lg:col-span-5 space-y-2 max-h-[70vh] overflow-y-auto pr-1">
            {filteredMessages.map((msg) => {
              const isSelected = selectedMessage?.id === msg.id;
              return (
                <div
                  key={msg.id}
                  onClick={() => handleSelectMessage(msg)}
                  className={`p-4 rounded-xl cursor-pointer transition-all border ${
                    isSelected
                      ? "bg-[#f3ece0] border-[#1a3826] shadow-sm"
                      : "bg-white border-[#e5dccb] hover:bg-[#faf7f0]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-[#111827]">
                      {msg.nom}
                    </span>
                    {!msg.statut_lu ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#b45309]" />
                    ) : (
                      <span className="text-[11px] text-gray-400 font-mono">
                        Lu
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-[#1a3826] line-clamp-1 mb-1">
                    {msg.sujet}
                  </p>
                  <p className="text-xs text-[#4b5563] line-clamp-2">
                    {msg.contenu}
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 text-[11px] text-gray-400">
                    <span>{formatDate(msg.date_envoi)}</span>
                    <span>{msg.email}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Reading Pane column (7 cols) */}
          <div className="lg:col-span-7">
            {selectedMessage ? (
              <div className="bg-white border border-[#e5dccb] rounded-xl p-6 sm:p-8 shadow-xs sticky top-24">
                <div className="flex items-start justify-between pb-6 border-b border-[#e5dccb]">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {!selectedMessage.statut_lu ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#b45309] text-white">
                          <Mail size={12} /> Non lu
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                          <MailOpen size={12} /> Lu
                        </span>
                      )}
                      <span className="text-xs text-gray-500 font-mono">
                        {formatDate(selectedMessage.date_envoi)}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold font-serif-custom text-[#111827]">
                      {selectedMessage.sujet}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      De : <span className="font-semibold text-[#111827]">{selectedMessage.nom}</span> ({selectedMessage.email})
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        handleToggleRead(
                          selectedMessage,
                          !selectedMessage.statut_lu
                        )
                      }
                      title={
                        selectedMessage.statut_lu
                          ? "Marquer non lu"
                          : "Marquer lu"
                      }
                      className="p-2 rounded-lg bg-white border border-[#e5dccb] text-gray-600 hover:text-[#1a3826] hover:bg-gray-50 transition-all"
                    >
                      {selectedMessage.statut_lu ? (
                        <Mail size={16} />
                      ) : (
                        <MailOpen size={16} />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(selectedMessage.id)}
                      title="Supprimer"
                      className="p-2 rounded-lg bg-white border border-red-200 text-red-600 hover:bg-red-50 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="py-6 whitespace-pre-wrap text-sm sm:text-base text-[#111827] leading-relaxed">
                  {selectedMessage.contenu}
                </div>

                <div className="pt-6 border-t border-[#e5dccb] flex items-center justify-between">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.sujet)}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1a3826] hover:bg-[#142a1d] text-white text-sm font-semibold rounded-lg transition-all shadow-xs"
                  >
                    <span>Répondre par Email</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-[#e5dccb] rounded-xl p-12 text-center text-gray-500">
                <p>Sélectionnez un message pour le lire dans le volet de lecture.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
