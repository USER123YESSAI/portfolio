const { Experience } = require("../models");
const asyncHandler = require("../utils/asyncHandler");

const getAll = asyncHandler(async (_req, res) => {
  const experiences = await Experience.findAll({
    order: [["date_debut", "DESC"]],
  });
  res.json(experiences);
});

const create = asyncHandler(async (req, res) => {
  const experience = await Experience.create({ ...req.body, user_id: req.user.id });
  res.status(201).json(experience);
});

const update = asyncHandler(async (req, res) => {
  const experience = await Experience.findByPk(req.params.id);
  if (!experience) return res.status(404).json({ message: "Expérience introuvable." });
  await experience.update(req.body);
  res.json(experience);
});

const remove = asyncHandler(async (req, res) => {
  const experience = await Experience.findByPk(req.params.id);
  if (!experience) return res.status(404).json({ message: "Expérience introuvable." });
  await experience.destroy();
  res.json({ message: "Expérience supprimée." });
});

module.exports = { getAll, create, update, remove };
