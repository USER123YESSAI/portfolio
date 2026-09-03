const sequelize = require("../config/database");
const User = require("./User");
const Project = require("./Project");
const Skill = require("./Skill");
const Experience = require("./Experience");
const Education = require("./Education");
const Certification = require("./Certification");
const Message = require("./Message");
const Setting = require("./Setting");

User.hasMany(Project, { foreignKey: "user_id", onDelete: "CASCADE" });
Project.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(Skill, { foreignKey: "user_id", onDelete: "CASCADE" });
Skill.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(Experience, { foreignKey: "user_id", onDelete: "CASCADE" });
Experience.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(Education, { foreignKey: "user_id", onDelete: "CASCADE" });
Education.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(Certification, { foreignKey: "user_id", onDelete: "CASCADE" });
Certification.belongsTo(User, { foreignKey: "user_id" });

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
