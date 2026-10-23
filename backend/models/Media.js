const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Media = sequelize.define(
  "Media",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    filename: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    folder: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    mimetype: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    data: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
    },
  },
  { tableName: "media", timestamps: true }
);

module.exports = Media;
