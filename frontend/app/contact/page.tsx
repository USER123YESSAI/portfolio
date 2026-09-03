import { Mail, MapPin, Phone } from "lucide-react";
import PublicLayout from "@/components/layout/PublicLayout";
import ContactForm from "@/components/sections/ContactForm";
import { getSettings } from "@/lib/api";
import type { Metadata } from "next";
import type { SiteSettings } from "@/types";

export const metadata: Metadata = {
  title: "Contact - Yessaïn Nanadoumadji",
  description: "Contactez Yessaïn Nanadoumadji pour un projet ou une opportunité.",
};

export default async function ContactPage() {
  let settings: SiteSettings = {};

  try {
    settings = await getSettings();
  } catch {
    // API unavailable
  }

  return (
    <PublicLayout settings={settings}>
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          {/* Section Label: —— CONTACT */}
          <div className="flex items-center gap-3 mb-2">
            <span className="w-8 h-[1px]" style={{ backgroundColor: "var(--label-color)" }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--label-color)" }}>
              CONTACT
            </span>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 items-start mt-4">
            <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-28">
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold font-serif-custom mb-4" style={{ color: "var(--heading-color)" }}>
                  Me Contacter
                </h1>
                <p className="text-base leading-relaxed" style={{ color: "var(--body-text)" }}>
                  Vous avez une opportunité de stage, une alternance ou un projet à développer ? N&apos;hésitez pas à m&apos;écrire directement.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-3 font-medium" style={{ color: "var(--foreground)" }}>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "var(--icon-bg)", border: "1px solid var(--border)", color: "var(--icon-color)" }}>
                    <Mail size={18} />
                  </div>
                  <a
                    href={`mailto:${settings.email || "nanadoumadjiyessain@gmail.com"}`}
                    className="contact-link transition-colors"
                    style={{ color: "var(--foreground)" }}
                  >
                    {settings.email || "nanadoumadjiyessain@gmail.com"}
                  </a>
                </div>
                {(settings.phone || "+221 77 000 00 00") && (
                  <div className="flex items-center gap-3 font-medium" style={{ color: "var(--foreground)" }}>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "var(--icon-bg)", border: "1px solid var(--border)", color: "var(--icon-color)" }}>
                      <Phone size={18} />
                    </div>
                    <span style={{ color: "var(--foreground)" }}>{settings.phone || "+221 77 000 00 00"}</span>
                  </div>
                )}
                {(settings.location || "Dakar, Sénégal") && (
                  <div className="flex items-center gap-3 font-medium" style={{ color: "var(--foreground)" }}>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "var(--icon-bg)", border: "1px solid var(--border)", color: "var(--icon-color)" }}>
                      <MapPin size={18} />
                    </div>
                    <span style={{ color: "var(--foreground)" }}>{settings.location || "Dakar, Sénégal"}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-7">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
