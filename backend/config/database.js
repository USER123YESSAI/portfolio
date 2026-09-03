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

// Détection de la nécessité du chiffrement SSL (ex: Aiven MySQL ou configuration explicite)
const shouldUseSSL =
  process.env.DB_SSL === "true" ||
  (process.env.DATABASE_URL &&
    (process.env.DATABASE_URL.includes("aivencloud.com") ||
      process.env.DATABASE_URL.includes("ssl-mode=REQUIRED"))) ||
  (process.env.DB_HOST && process.env.DB_HOST.includes("aivencloud.com"));

const dialectOptions = shouldUseSSL
  ? {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    }
  : {};

let sequelize;

if (process.env.DATABASE_URL) {
  // Initialisation via URI complète Aiven (ex: mysql://avnadmin:pwd@host:port/defaultdb?ssl-mode=REQUIRED)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    ...commonOptions,
    dialectOptions,
  });
} else {
  // Initialisation via variables individuelles
  sequelize = new Sequelize(
    process.env.DB_NAME || "portfolio",
    process.env.DB_USER || "root",
    process.env.DB_PASSWORD || "",
    {
      ...commonOptions,
      host: process.env.DB_HOST || "127.0.0.1",
      port: parseInt(process.env.DB_PORT || "3306", 10),
      dialectOptions,
    }
  );
}

module.exports = sequelize;
