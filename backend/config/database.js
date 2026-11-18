const { Sequelize } = require("sequelize");
require("dotenv").config();

// Détection automatique du dialecte selon l'URL de connexion ou les variables
const rawUrl = process.env.DATABASE_URL || "";
const isPostgres =
  rawUrl.startsWith("postgres://") ||
  rawUrl.startsWith("postgresql://") ||
  rawUrl.includes("supabase.co") ||
  rawUrl.includes("neon.tech") ||
  process.env.DB_DIALECT === "postgres" ||
  process.env.DB_PORT === "5432";

const dialect = isPostgres ? "postgres" : "mysql";

// Configuration des options communes Sequelize
const commonOptions = {
  dialect,
  logging: process.env.NODE_ENV === "development" ? false : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    underscored: true,
    timestamps: true,
    createdAt: "date_creation",
    updatedAt: "date_modification",
  },
};

// Détection de la nécessité du chiffrement SSL (Supabase, TiDB Cloud, Aiven MySQL ou configuration explicite)
const isTiDB =
  rawUrl.includes("tidbcloud.com") ||
  (process.env.DB_HOST && process.env.DB_HOST.includes("tidbcloud.com"));

const shouldUseSSL =
  isPostgres ||
  process.env.DB_SSL === "true" ||
  isTiDB ||
  rawUrl.includes("aivencloud.com") ||
  rawUrl.includes("sslmode=require") ||
  rawUrl.includes("ssl-mode=REQUIRED") ||
  (process.env.DB_HOST && process.env.DB_HOST.includes("aivencloud.com"));

const dialectOptions = shouldUseSSL
  ? {
      ssl: {
        require: true,
        rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === "true",
      },
    }
  : {};

let sequelize;

if (process.env.DATABASE_URL) {
  // Initialisation via URI complète (Supabase, Neon, TiDB ou Aiven)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    ...commonOptions,
    dialectOptions,
  });
} else {
  // Initialisation via variables individuelles
  const defaultPort = isPostgres ? 5432 : isTiDB ? 4000 : 3306;
  sequelize = new Sequelize(
    process.env.DB_NAME || "portfolio",
    process.env.DB_USER || (isPostgres ? "postgres" : "root"),
    process.env.DB_PASSWORD || "",
    {
      ...commonOptions,
      host: process.env.DB_HOST || "127.0.0.1",
      port: parseInt(process.env.DB_PORT || String(defaultPort), 10),
      dialectOptions,
    }
  );
}

module.exports = sequelize;
