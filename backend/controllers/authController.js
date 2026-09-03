const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const asyncHandler = require("../utils/asyncHandler");

const login = asyncHandler(async (req, res) => {
  const { email, mot_de_passe } = req.body;

  if (!email || !mot_de_passe) {
    return res.status(400).json({ message: "Email et mot de passe requis." });
  }

  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(401).json({ message: "Identifiants invalides." });
  }

  const valid = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
  if (!valid) {
    return res.status(401).json({ message: "Identifiants invalides." });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  res.json({
    token,
    user: { id: user.id, nom: user.nom, email: user.email, role: user.role },
  });
});

const getMe = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id, {
    attributes: { exclude: ["mot_de_passe"] },
  });
  res.json(user);
});

module.exports = { login, getMe };
