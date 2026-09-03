# Portfolio Professionnel Full-Stack — Yessaïn Nanadoumadji

Portfolio moderne, dynamique et sécurisé conçu avec **Next.js (App Router, Tailwind CSS, TypeScript)** et une API REST robuste avec **Node.js (Express, Sequelize, MySQL)**.

---

## 🌟 Fonctionnalités

- **Section Accueil & Présentation :** Hero captivant avec navigation fluide et liens sociaux.
- **Section À propos :** Présentation personnalisée, photo portrait et atouts techniques.
- **Compétences :** Visualisation par catégories (Langages, Frameworks, Outils, Soft Skills).
- **Projets & Réalisations :** Grille de projets avec filtres, tags technologiques et liens démo/code source.
- **Parcours interactif :** Expériences professionnelles et formations académiques.
- **Téléchargement sécurisé du CV :** Accès au CV protégé par mot de passe avec boîte modale interactive.
- **Espace Administrateur complet :**
  - Authentification JWT avec limitation de débit (anti-brute force).
  - Gestion des projets, compétences, expériences, formations et certifications.
  - Boîte de réception des messages de contact avec indicateur de messages non lus.
  - Gestion des photos (profil & à propos) et configuration du mot de passe du CV.
- **Dark / Light Mode :** Persistance du thème choisi sans scintillement (FOUC).

---

## 🛠️ Stack Technique

- **Frontend :** Next.js 16, React 19, TypeScript, Tailwind CSS, Lucide React
- **Backend :** Node.js, Express 5, Sequelize ORM, MySQL, JWT, Bcrypt, Multer
- **Déploiement :**
  - **Frontend :** Vercel
  - **Backend :** Render
  - **Base de données :** Aiven (MySQL Cloud avec chiffrement SSL)

---

## 🚀 Démarrage en local

### 1. Prérequis
- Node.js (v18+)
- MySQL (local ou distant)

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env # Configurer vos accès MySQL
npm run seed        # Initialiser les tables et les données
npm run dev         # Démarrer le serveur sur http://localhost:5000
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev         # Démarrer le client sur http://localhost:3000
```

---

## 📄 Licence
Tous droits réservés © 2026 Yessaïn Nanadoumadji.
