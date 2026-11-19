const sequelize = require("../config/database");
const User = require("./User");
const Project = require("./Project");
const Skill = require("./Skill");
const Experience = require("./Experience");
const Education = require("./Education");
const Certification = require("./Certification");
const Message = require("./Message");
const Setting = require("./Setting");

User.hasMany(Project, { foreignKey: { name: "user_id", allowNull: true }, onDelete: "CASCADE" });
Project.belongsTo(User, { foreignKey: { name: "user_id", allowNull: true } });

User.hasMany(Skill, { foreignKey: { name: "user_id", allowNull: true }, onDelete: "CASCADE" });
Skill.belongsTo(User, { foreignKey: { name: "user_id", allowNull: true } });

User.hasMany(Experience, { foreignKey: { name: "user_id", allowNull: true }, onDelete: "CASCADE" });
Experience.belongsTo(User, { foreignKey: { name: "user_id", allowNull: true } });

User.hasMany(Education, { foreignKey: { name: "user_id", allowNull: true }, onDelete: "CASCADE" });
Education.belongsTo(User, { foreignKey: { name: "user_id", allowNull: true } });

User.hasMany(Certification, { foreignKey: { name: "user_id", allowNull: true }, onDelete: "CASCADE" });
Certification.belongsTo(User, { foreignKey: { name: "user_id", allowNull: true } });

module.exports = {
  sequelize,
  User,
  Project,
  Skill,
  Experience,
  Education,
  Certification,
  Message,
  Setting,
};
