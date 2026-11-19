const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Project = sequelize.define(
  "Project",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    titre: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    technologies: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    categorie: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    images: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: "[]",
      get() {
        const raw = this.getDataValue("images");
        if (!raw) return [];
        if (Array.isArray(raw)) return raw;
        try {
          return typeof raw === "string" ? JSON.parse(raw) : raw;
        } catch {
          return [raw];
        }
      },
      set(val) {
        if (Array.isArray(val)) {
          this.setDataValue("images", JSON.stringify(val));
        } else if (typeof val === "string") {
          this.setDataValue("images", val);
        } else {
          this.setDataValue("images", "[]");
        }
      },
    },
    lien_demo: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    lien_github: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    date_realisation: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    mis_en_avant: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    archive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  { tableName: "projects" }
);

module.exports = Project;
