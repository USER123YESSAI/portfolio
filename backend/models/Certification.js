const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Certification = sequelize.define(
  "Certification",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nom: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    organisme: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    date_obtention: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    lien_justificatif: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
  },
  { tableName: "certifications" }
);

module.exports = Certification;
