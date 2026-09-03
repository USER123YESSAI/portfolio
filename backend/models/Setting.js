const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Setting = sequelize.define(
  "Setting",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    cle: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    valeur: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  { tableName: "settings", updatedAt: false, createdAt: false }
);

module.exports = Setting;
