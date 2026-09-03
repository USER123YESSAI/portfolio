const { Education } = require("../models");
const asyncHandler = require("../utils/asyncHandler");

const getAll = asyncHandler(async (_req, res) => {
  const educations = await Education.findAll({
    order: [["date_debut", "DESC"]],
  });
  res.json(educations);
});

const create = asyncHandler(async (req, res) => {
  const education = await Education.create({ ...req.body, user_id: req.user.id });
  res.status(201).json(education);
});

const update = asyncHandler(async (req, res) => {
  const education = await Education.findByPk(req.params.id);
  if (!education) return res.status(404).json({ message: "Formation introuvable." });
  await education.update(req.body);
  res.json(education);
});

const remove = asyncHandler(async (req, res) => {
  const education = await Education.findByPk(req.params.id);
  if (!education) return res.status(404).json({ message: "Formation introuvable." });
  await education.destroy();
  res.json({ message: "Formation supprimée." });
});

module.exports = { getAll, create, update, remove };
