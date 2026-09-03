import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "Yessaïn Nanadoumadji — Développeur Full-Stack",
    template: "%s | Yessaïn Nanadoumadji",
  },
  description:
    "Portfolio professionnel de Yessaïn Nanadoumadji, développeur full-stack. Découvrez mes projets, compétences et parcours.",
  keywords: ["portfolio", "développeur", "full-stack", "React", "Next.js", "Node.js"],
  authors: [{ name: "Yessaïn Nanadoumadji" }],
  openGraph: {
    title: "Yessaïn Nanadoumadji — Développeur Full-Stack",
    description: "Portfolio professionnel — projets, compétences et parcours.",
    type: "website",
    locale: "fr_FR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${inter.variable} ${playfair.variable} h-full`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('portfolio-theme');var theme=t==='dark'?'dark':'light';document.documentElement.setAttribute('data-theme',theme);}catch(e){}})()`,
          }}
        />
      </head>
      <body suppressHydrationWarning className="min-h-full antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
