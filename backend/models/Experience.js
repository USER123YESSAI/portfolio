const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Experience = sequelize.define(
  "Experience",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    poste: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    entreprise: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    date_debut: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    date_fin: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  { tableName: "experiences" }
);

module.exports = Experience;
