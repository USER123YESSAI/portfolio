const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Message = sequelize.define(
  "Message",
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
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: { isEmail: true },
    },
    sujet: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    contenu: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    date_envoi: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    statut_lu: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  { tableName: "messages", updatedAt: false, createdAt: false }
);

module.exports = Message;
