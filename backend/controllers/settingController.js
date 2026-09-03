const path = require("path");
const fs = require("fs");
const { Setting } = require("../models");
const asyncHandler = require("../utils/asyncHandler");

const getAll = asyncHandler(async (_req, res) => {
  const settings = await Setting.findAll();
  const result = {};
  settings.forEach((s) => {
    try {
      result[s.cle] = JSON.parse(s.valeur);
    } catch {
      result[s.cle] = s.valeur;
    }
  });
  res.json(result);
});

const update = asyncHandler(async (req, res) => {
  const updates = req.body || {};

  for (const [cle, valeur] of Object.entries(updates)) {
    const val =
      valeur === null || valeur === undefined
        ? ""
        : typeof valeur === "object"
        ? JSON.stringify(valeur)
        : String(valeur);
    await Setting.upsert({ cle, valeur: val });
  }

  const settings = await Setting.findAll();
  const result = {};
  settings.forEach((s) => {
    try {
      result[s.cle] = JSON.parse(s.valeur);
    } catch {
      result[s.cle] = s.valeur;
    }
  });

  res.json(result);
});

const verifyCVPassword = asyncHandler(async (req, res) => {
  const { password } = req.body || {};
  const passSetting = await Setting.findOne({ where: { cle: "cv_password" } });

  // Si aucun mot de passe n'est configuré, accès libre
  if (!passSetting || !passSetting.valeur) {
    return res.json({ valid: true, message: "Accès autorisé." });
  }

  if (!password || password.trim() !== passSetting.valeur.trim()) {
    return res.status(403).json({ message: "Mot de passe incorrect." });
  }

  res.json({ valid: true, message: "Accès autorisé." });
});

const downloadCV = asyncHandler(async (req, res) => {
  const passSetting = await Setting.findOne({ where: { cle: "cv_password" } });
  
  if (passSetting && passSetting.valeur) {
    const providedPass = req.query.password || (req.body && req.body.password);
    if (!providedPass || providedPass.trim() !== passSetting.valeur.trim()) {
      return res.status(403).json({ message: "Mot de passe requis ou incorrect." });
    }
  }

  const setting = await Setting.findOne({ where: { cle: "cv_path" } });
  if (!setting || !setting.valeur) {
    return res.status(404).json({ message: "CV non disponible." });
  }

  const cleanVal = setting.valeur.replace(/^\//, "");
  const filePath = path.join(__dirname, "..", cleanVal);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "Fichier CV introuvable." });
  }

  res.download(filePath, "CV-Yessain-Nanadoumadji.pdf");
});

const uploadCV = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Aucun fichier reçu." });
  }

  const cvPath = `/uploads/cv/${req.file.filename}`;
  await Setting.upsert({ cle: "cv_path", valeur: cvPath });
  res.json({ message: "CV mis à jour.", cv_path: cvPath });
});

const uploadProfile = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Aucun fichier reçu." });
  }

  const profilePath = `/uploads/profile/${req.file.filename}`;
  await Setting.upsert({ cle: "profile_photo", valeur: profilePath });
  res.json({ message: "Photo de profil mise à jour.", profile_photo: profilePath });
});

const uploadAboutPhoto = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Aucun fichier reçu." });
  }

  const aboutPath = `/uploads/profile/${req.file.filename}`;
  await Setting.upsert({ cle: "about_photo", valeur: aboutPath });
  res.json({ message: "Photo À propos mise à jour.", about_photo: aboutPath });
});

module.exports = {
  getAll,
  update,
  downloadCV,
  verifyCVPassword,
  uploadCV,
  uploadProfile,
  uploadAboutPhoto,
};
