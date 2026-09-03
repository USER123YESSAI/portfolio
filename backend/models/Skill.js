const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Skill = sequelize.define(
  "Skill",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nom: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    categorie: {
      type: DataTypes.ENUM(
        "langages",
        "frameworks",
        "outils",
        "soft_skills"
      ),
      allowNull: false,
    },
    niveau: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 100 },
    },
    icone: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  },
  { tableName: "skills" }
);

module.exports = Skill;
