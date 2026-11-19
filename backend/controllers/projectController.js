const fs = require("fs");
const { Project, User } = require("../models");
const asyncHandler = require("../utils/asyncHandler");

const normalizeProject = (project) => {
  if (!project) return project;
  const p = project.toJSON ? project.toJSON() : project;
  if (typeof p.technologies === "string") {
    try {
      p.technologies = JSON.parse(p.technologies);
    } catch {
      p.technologies = p.technologies.split(",").map((t) => t.trim()).filter(Boolean);
    }
  }
  if (!Array.isArray(p.technologies)) {
    p.technologies = [];
  }

  // Normalisation de la galerie d'images
  if (typeof p.images === "string") {
    try {
      p.images = JSON.parse(p.images);
    } catch {
      p.images = [p.images].filter(Boolean);
    }
  }
  if (!Array.isArray(p.images)) {
    p.images = [];
  }
  if (p.images.length === 0 && p.image) {
    p.images = [p.image];
  }
  if (!p.image && p.images.length > 0) {
    p.image = p.images[0];
  }

  return p;
};

const getAll = asyncHandler(async (req, res) => {
  const { technologie, categorie } = req.query;
  const where = { archive: false };

  if (categorie) where.categorie = categorie;

  let projects;
  try {
    projects = await Project.findAll({
      where,
      order: [
        ["mis_en_avant", "DESC"],
        ["date_realisation", "DESC"],
      ],
    });
  } catch (err) {
    console.error("Erreur getAll (fallback sans colonne 'images') :", err.message);
    projects = await Project.findAll({
      where,
      attributes: { exclude: ["images"] },
      order: [
        ["mis_en_avant", "DESC"],
        ["date_realisation", "DESC"],
      ],
    });
  }

  projects = projects.map(normalizeProject);

  if (technologie) {
    const term = technologie.toLowerCase();
    projects = projects.filter((p) =>
      (p.technologies || []).some((t) => t.toLowerCase().includes(term))
    );
  }

  res.json(projects);
});

const getAdminAll = asyncHandler(async (_req, res) => {
  let projects;
  try {
    projects = await Project.findAll({
      order: [
        ["mis_en_avant", "DESC"],
        ["date_realisation", "DESC"],
        ["id", "DESC"],
      ],
    });
  } catch (err) {
    console.error("Erreur getAdminAll (fallback sans colonne 'images') :", err.message);
    projects = await Project.findAll({
      attributes: { exclude: ["images"] },
      order: [
        ["mis_en_avant", "DESC"],
        ["date_realisation", "DESC"],
        ["id", "DESC"],
      ],
    });
  }
  res.json(projects.map(normalizeProject));
});

const getById = asyncHandler(async (req, res) => {
  let project;
  try {
    project = await Project.findByPk(req.params.id);
  } catch {
    project = await Project.findByPk(req.params.id, { attributes: { exclude: ["images"] } });
  }
  if (!project || project.archive) {
    return res.status(404).json({ message: "Projet introuvable." });
  }
  res.json(normalizeProject(project));
});

const getAdminById = asyncHandler(async (req, res) => {
  let project;
  try {
    project = await Project.findByPk(req.params.id);
  } catch {
    project = await Project.findByPk(req.params.id, { attributes: { exclude: ["images"] } });
  }
  if (!project) {
    return res.status(404).json({ message: "Projet introuvable." });
  }
  res.json(normalizeProject(project));
});

const parseProjectData = (body, req) => {
  const data = { ...body };

  // 1. Récupération des images existantes conservées
  let existingImages = [];
  if (body.existing_images) {
    try {
      existingImages = typeof body.existing_images === "string"
        ? JSON.parse(body.existing_images)
        : body.existing_images;
    } catch {
      existingImages = Array.isArray(body.existing_images) ? body.existing_images : [body.existing_images];
    }
  }

  // 2. Conversion de tous les fichiers uploadés en Base64 Data URL permanents
  const files = req.files || (req.file ? [req.file] : []);
  const newUploadedImages = [];

  for (const f of files) {
    try {
      const fileBuffer = fs.readFileSync(f.path);
      const dataUrl = `data:${f.mimetype};base64,${fileBuffer.toString("base64")}`;
      newUploadedImages.push(dataUrl);
    } catch (err) {
      console.error("Erreur de conversion Base64 pour le fichier :", f.filename, err);
      newUploadedImages.push(`/uploads/projects/${f.filename}`);
    }
  }

  // 3. Fusion des images existantes et des nouvelles images (ou prise en compte des suppressions)
  if (body.existing_images !== undefined || newUploadedImages.length > 0) {
    const combined = [...existingImages, ...newUploadedImages];
    data.images = combined;
    data.image = combined.length > 0 ? combined[0] : null;
  } else if (body.image) {
    data.image = body.image;
    data.images = [body.image];
  }

  if (typeof data.technologies === "string") {
    try {
      data.technologies = JSON.parse(data.technologies);
    } catch {
      data.technologies = data.technologies
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    }
  }
  if (data.mis_en_avant !== undefined) {
    data.mis_en_avant = data.mis_en_avant === "true" || data.mis_en_avant === true;
  }
  if (data.archive !== undefined) {
    data.archive = data.archive === "true" || data.archive === true;
  }

  // Nettoyage spécifique pour la compatibilité PostgreSQL
  if (!data.date_realisation || String(data.date_realisation).trim() === "") {
    data.date_realisation = null;
  }
  if (!data.lien_demo || String(data.lien_demo).trim() === "") {
    data.lien_demo = null;
  }
  if (!data.lien_github || String(data.lien_github).trim() === "") {
    data.lien_github = null;
  }
  if (!data.categorie || String(data.categorie).trim() === "") {
    data.categorie = "Full-Stack";
  }

  return data;
};

const create = asyncHandler(async (req, res) => {
  const data = parseProjectData(req.body, req);

  // Résolution sécurisée de user_id pour éviter toute violation de clé étrangère
  if (req.user && req.user.id) {
    const userExists = await User.findByPk(req.user.id);
    if (userExists) {
      data.user_id = userExists.id;
    } else {
      const firstAdmin = await User.findOne({ order: [["id", "ASC"]] });
      data.user_id = firstAdmin ? firstAdmin.id : null;
    }
  } else {
    const firstAdmin = await User.findOne({ order: [["id", "ASC"]] });
    data.user_id = firstAdmin ? firstAdmin.id : null;
  }

  let project;
  try {
    project = await Project.create(data);
  } catch (err) {
    console.error("Erreur création projet (fallback sécurisé) :", err.message);
    if (err.message && (err.message.includes("varying(500)") || err.message.includes("value too long"))) {
      if (data.lien_demo && data.lien_demo.length > 500) {
        data.lien_demo = data.lien_demo.slice(0, 500);
      }
      if (data.lien_github && data.lien_github.length > 500) {
        data.lien_github = data.lien_github.slice(0, 500);
      }
    }
    delete data.images;
    project = await Project.create(data);
  }
  res.status(201).json(normalizeProject(project));
});

const update = asyncHandler(async (req, res) => {
  const project = await Project.findByPk(req.params.id);
  if (!project) return res.status(404).json({ message: "Projet introuvable." });

  const data = parseProjectData(req.body, req);
  try {
    await project.update(data);
  } catch (err) {
    console.error("Erreur mise à jour projet (fallback sécurisé) :", err.message);
    if (err.message && (err.message.includes("varying(500)") || err.message.includes("value too long"))) {
      if (data.lien_demo && data.lien_demo.length > 500) {
        data.lien_demo = data.lien_demo.slice(0, 500);
      }
      if (data.lien_github && data.lien_github.length > 500) {
        data.lien_github = data.lien_github.slice(0, 500);
      }
    }
    delete data.images;
    await project.update(data);
  }
  res.json(normalizeProject(project));
});

const remove = asyncHandler(async (req, res) => {
  const project = await Project.findByPk(req.params.id);
  if (!project) return res.status(404).json({ message: "Projet introuvable." });
  await project.destroy();
  res.json({ message: "Projet supprimé." });
});

const archive = asyncHandler(async (req, res) => {
  const project = await Project.findByPk(req.params.id);
  if (!project) return res.status(404).json({ message: "Projet introuvable." });
  await project.update({ archive: !project.archive });
  res.json({ message: `Projet ${project.archive ? "archivé" : "désarchivé"}.`, project });
});

module.exports = { getAll, getAdminAll, getById, getAdminById, create, update, remove, archive };
