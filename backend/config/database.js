const { Sequelize } = require("sequelize");
require("dotenv").config();

// Configuration des options communes Sequelize
const commonOptions = {
  dialect: "mysql",
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

// Détection de la nécessité du chiffrement SSL (ex: TiDB Cloud, Aiven MySQL ou configuration explicite)
const isTiDB =
  (process.env.DATABASE_URL && process.env.DATABASE_URL.includes("tidbcloud.com")) ||
  (process.env.DB_HOST && process.env.DB_HOST.includes("tidbcloud.com"));

const shouldUseSSL =
  process.env.DB_SSL === "true" ||
  isTiDB ||
  (process.env.DATABASE_URL &&
    (process.env.DATABASE_URL.includes("aivencloud.com") ||
      process.env.DATABASE_URL.includes("ssl-mode=REQUIRED") ||
      process.env.DATABASE_URL.includes("ssl="))) ||
  (process.env.DB_HOST && process.env.DB_HOST.includes("aivencloud.com"));

const dialectOptions = shouldUseSSL
  ? {
      ssl: {
        minVersion: "TLSv1.2",
        require: true,
        rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === "true",
      },
    }
  : {};

let sequelize;

if (process.env.DATABASE_URL) {
  // Initialisation via URI complète (ex: mysql://user:pwd@gateway01.eu-central-1.prod.aws.tidbcloud.com:4000/portfolio)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    ...commonOptions,
    dialectOptions,
  });
} else {
  // Initialisation via variables individuelles
  const defaultPort = isTiDB ? 4000 : 3306;
  sequelize = new Sequelize(
    process.env.DB_NAME || "portfolio",
    process.env.DB_USER || "root",
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
