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
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    lien_demo: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    lien_github: {
      type: DataTypes.STRING(500),
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
