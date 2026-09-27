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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yessain-nanadoumadji.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Yessaïn Nanadoumadji — Développeur Full-Stack",
    template: "%s | Yessaïn Nanadoumadji",
  },
  description:
    "Portfolio professionnel de Yessaïn Nanadoumadji, développeur full-stack. Découvrez mes projets, compétences en conception logicielle et parcours.",
  keywords: [
    "Yessaïn Nanadoumadji",
    "Yessain Nanadoumadji",
    "Nanadoumadji Yessaïn",
    "Yessain",
    "Développeur Full-Stack",
    "Développeur Web Dakar",
    "React",
    "Next.js",
    "Node.js",
    "Conception des Systèmes d'Information",
    "Portfolio Yessaïn Nanadoumadji"
  ],
  authors: [{ name: "Yessaïn Nanadoumadji", url: siteUrl }],
  creator: "Yessaïn Nanadoumadji",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Yessaïn Nanadoumadji — Développeur Full-Stack",
    description:
      "Portfolio professionnel de Yessaïn Nanadoumadji — découvrez mes projets, compétences et parcours.",
    url: siteUrl,
    siteName: "Yessaïn Nanadoumadji Portfolio",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "/images/profil.png",
        width: 1200,
        height: 630,
        alt: "Yessaïn Nanadoumadji — Développeur Full-Stack",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yessaïn Nanadoumadji — Développeur Full-Stack",
    description:
      "Portfolio professionnel de Yessaïn Nanadoumadji — projets, compétences et parcours.",
    images: ["/images/profil.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "3c4rwlF8Ve_zPpNy-l4rkl0YhbUNrLP3z6SR_4DUmfc",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: "Yessaïn Nanadoumadji",
      alternateName: ["Yessain Nanadoumadji", "Nanadoumadji Yessaïn"],
      jobTitle: "Développeur Full-Stack",
      description:
        "Développeur Full-Stack spécialisé en React, Next.js, Node.js et en conception des systèmes d'information.",
      url: siteUrl,
      image: `${siteUrl}/images/profil.png`,
      email: "nanadoumadjiyessain@gmail.com",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Dakar",
        addressCountry: "Sénégal",
      },
      alumniOf: {
        "@type": "EducationalOrganization",
        name: "EPF Africa",
      },
      sameAs: [
        "https://github.com/YessainDev",
        "https://linkedin.com/in/yessain"
      ],
      knowsAbout: [
        "React",
        "Next.js",
        "Node.js",
        "TypeScript",
        "JavaScript",
        "Tailwind CSS",
        "Express",
        "Sequelize",
        "MySQL",
        "REST API"
      ]
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Yessaïn Nanadoumadji Portfolio",
      description: "Portfolio professionnel de Yessaïn Nanadoumadji",
      publisher: {
        "@id": `${siteUrl}/#person`,
      },
      inLanguage: "fr-FR",
    },
  ],
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
        <meta name="google-site-verification" content="3c4rwlF8Ve_zPpNy-l4rkl0YhbUNrLP3z6SR_4DUmfc" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('portfolio-theme');var theme=t==='dark'?'dark':'light';document.documentElement.setAttribute('data-theme',theme);}catch(e){}})()`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning className="min-h-full antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
