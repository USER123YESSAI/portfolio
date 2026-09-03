const { Message } = require("../models");
const asyncHandler = require("../utils/asyncHandler");

const getAll = asyncHandler(async (_req, res) => {
  const messages = await Message.findAll({ order: [["date_envoi", "DESC"]] });
  res.json(messages);
});

const markAsRead = asyncHandler(async (req, res) => {
  const message = await Message.findByPk(req.params.id);
  if (!message) return res.status(404).json({ message: "Message introuvable." });
  await message.update({ statut_lu: true });
  res.json(message);
});

const remove = asyncHandler(async (req, res) => {
  const message = await Message.findByPk(req.params.id);
  if (!message) return res.status(404).json({ message: "Message introuvable." });
  await message.destroy();
  res.json({ message: "Message supprimé." });
});

module.exports = { getAll, markAsRead, remove };
