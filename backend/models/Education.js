const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Education = sequelize.define(
  "Education",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    intitule: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    etablissement: {
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
  { tableName: "educations" }
);

module.exports = Education;
