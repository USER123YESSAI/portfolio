require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");
const rateLimit = require("express-rate-limit");
const { sequelize } = require("./models");
const apiRoutes = require("./routes/api.routes");
const adminRoutes = require("./routes/admin.routes");
const authRoutes = require("./routes/auth.routes");
const errorHandler = require("./middleware/errorHandler");

// ── Validation des variables d'environnement critiques ─────────────────────
if (!process.env.JWT_SECRET) {
  console.error("ERREUR FATALE : JWT_SECRET n'est pas défini dans .env");
  process.exit(1);
}

// ── Création automatique des répertoires d'upload (pour Render) ────────────
const uploadDirs = [
  path.join(__dirname, "uploads"),
  path.join(__dirname, "uploads", "projects"),
  path.join(__dirname, "uploads", "profile"),
  path.join(__dirname, "uploads", "cv"),
];
uploadDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const app = express();
const PORT = process.env.PORT || 5000;

// ── Sécurité HTTP headers ────────────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

// ── CORS ─────────────────────────────────────────────────────────────────────
const getAllowedOrigins = () => {
  const envOrigins = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(",").map((url) => url.trim())
    : [];
  return [
    ...envOrigins,
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ];
};

app.use(
  cors({
    origin: (origin, callback) => {
      // Autoriser les requêtes sans origine (ex: curl, Postman, SSR serveur)
      if (!origin) return callback(null, true);

      const allowed = getAllowedOrigins();
      const isAllowedExact = allowed.includes(origin);
      // Autorise les déploiements preview de Vercel (*.vercel.app)
      const isVercelPreview = /^https:\/\/[a-zA-Z0-9_-]+\.vercel\.app$/.test(origin);

      if (isAllowedExact || isVercelPreview) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
  })
);

// ── Logging ──────────────────────────────────────────────────────────────────
app.use(morgan("dev"));

// ── Body parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ── Fichiers statiques (uploads) avec cache agressif (30 jours) ─────────────
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    maxAge: "30d",
    immutable: true,
    etag: true,
  })
);

// ── Rate limiter sur la route d'authentification (anti brute-force) ──────────
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,                    // max 5 tentatives par fenêtre
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Trop de tentatives de connexion. Veuillez réessayer dans 15 minutes.",
  },
  skipSuccessfulRequests: true, // ne compte pas les connexions réussies
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "API Portfolio opérationnelle" });
});

app.use("/api/auth/login", loginLimiter);
app.use("/api/auth", authRoutes);
app.use("/api", apiRoutes);
app.use("/api/admin", adminRoutes);

// ── Gestion des erreurs ───────────────────────────────────────────────────────
app.use(errorHandler);

// ── Démarrage ─────────────────────────────────────────────────────────────────
const start = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connexion à la base de données établie.");

    // Préserver strictement les tables et données existantes
    await sequelize.sync();
    console.log("Modèles synchronisés.");

    // Initialisation automatique si la base est neuve
    const { User } = require("./models");
    const userCount = await User.count();
    if (userCount === 0) {
      console.log("Nouvelle base détectée (0 utilisateur). Initialisation automatique...");
      const { runSeed } = require("./seeds/seedRunner");
      await runSeed();
    } else if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
      const bcrypt = require("bcrypt");
      const adminEmail = process.env.ADMIN_EMAIL.trim();
      const adminPassword = process.env.ADMIN_PASSWORD.trim();
      const existingAdmin = await User.findOne({ where: { email: adminEmail } });

      if (!existingAdmin) {
        console.log(`Création de l'administrateur configuré : ${adminEmail}`);
        await User.create({
          nom: "Yessaïn Nanadoumadji",
          email: adminEmail,
          mot_de_passe: await bcrypt.hash(adminPassword, 12),
          role: "admin",
        });
      } else {
        const match = await bcrypt.compare(adminPassword, existingAdmin.mot_de_passe);
        if (!match) {
          console.log(`Synchronisation du mot de passe pour l'administrateur : ${adminEmail}`);
          existingAdmin.mot_de_passe = await bcrypt.hash(adminPassword, 12);
          await existingAdmin.save();
        }
      }
    }

    app.listen(PORT, () => {
      console.log(`Serveur démarré sur http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Impossible de démarrer le serveur:", error.message);
    process.exit(1);
  }
};

start();
