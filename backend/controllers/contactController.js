const { Message } = require("../models");
const asyncHandler = require("../utils/asyncHandler");

const sendContact = asyncHandler(async (req, res) => {
  const { nom, email, sujet, contenu } = req.body;

  if (!nom || !email || !sujet || !contenu) {
    return res.status(400).json({ message: "Tous les champs sont requis." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Adresse e-mail invalide." });
  }

  const message = await Message.create({
    nom,
    email,
    sujet,
    contenu,
    date_envoi: new Date(),
    statut_lu: false,
  });

  res.status(201).json({
    message: "Votre message a été envoyé avec succès.",
    id: message.id,
  });
});

module.exports = { sendContact };
