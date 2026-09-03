const { Skill } = require("../models");
const asyncHandler = require("../utils/asyncHandler");

const getAll = asyncHandler(async (_req, res) => {
  const skills = await Skill.findAll({ order: [["categorie", "ASC"], ["nom", "ASC"]] });
  res.json(skills);
});

const create = asyncHandler(async (req, res) => {
  const skill = await Skill.create({ ...req.body, user_id: req.user.id });
  res.status(201).json(skill);
});

const update = asyncHandler(async (req, res) => {
  const skill = await Skill.findByPk(req.params.id);
  if (!skill) return res.status(404).json({ message: "Compétence introuvable." });
  await skill.update(req.body);
  res.json(skill);
});

const remove = asyncHandler(async (req, res) => {
  const skill = await Skill.findByPk(req.params.id);
  if (!skill) return res.status(404).json({ message: "Compétence introuvable." });
  await skill.destroy();
  res.json({ message: "Compétence supprimée." });
});

module.exports = { getAll, create, update, remove };
