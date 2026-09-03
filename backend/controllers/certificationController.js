const { Certification } = require("../models");
const asyncHandler = require("../utils/asyncHandler");

const getAll = asyncHandler(async (_req, res) => {
  const certifications = await Certification.findAll({
    order: [["date_obtention", "DESC"]],
  });
  res.json(certifications);
});

const create = asyncHandler(async (req, res) => {
  const certification = await Certification.create({
    ...req.body,
    user_id: req.user.id,
  });
  res.status(201).json(certification);
});

const update = asyncHandler(async (req, res) => {
  const certification = await Certification.findByPk(req.params.id);
  if (!certification) {
    return res.status(404).json({ message: "Certification introuvable." });
  }
  await certification.update(req.body);
  res.json(certification);
});

const remove = asyncHandler(async (req, res) => {
  const certification = await Certification.findByPk(req.params.id);
  if (!certification) {
    return res.status(404).json({ message: "Certification introuvable." });
  }
  await certification.destroy();
  res.json({ message: "Certification supprimée." });
});

module.exports = { getAll, create, update, remove };
