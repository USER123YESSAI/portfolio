const { Project } = require("../models");
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
  return p;
};

const getAll = asyncHandler(async (req, res) => {
  const { technologie, categorie } = req.query;
  const where = { archive: false };

  if (categorie) where.categorie = categorie;

  let projects = await Project.findAll({
    where,
    order: [
      ["mis_en_avant", "DESC"],
      ["date_realisation", "DESC"],
    ],
  });

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
  const projects = await Project.findAll({
    order: [
      ["mis_en_avant", "DESC"],
      ["date_realisation", "DESC"],
      ["id", "DESC"],
    ],
  });
  res.json(projects.map(normalizeProject));
});

const getById = asyncHandler(async (req, res) => {
  const project = await Project.findByPk(req.params.id);
  if (!project || project.archive) {
    return res.status(404).json({ message: "Projet introuvable." });
  }
  res.json(normalizeProject(project));
});

const getAdminById = asyncHandler(async (req, res) => {
  const project = await Project.findByPk(req.params.id);
  if (!project) {
    return res.status(404).json({ message: "Projet introuvable." });
  }
  res.json(normalizeProject(project));
});

const parseProjectData = (body, file) => {
  const data = { ...body };
  if (file) data.image = `/uploads/projects/${file.filename}`;
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
  return data;
};

const create = asyncHandler(async (req, res) => {
  const data = parseProjectData(req.body, req.file);
  data.user_id = req.user.id;
  const project = await Project.create(data);
  res.status(201).json(normalizeProject(project));
});

const update = asyncHandler(async (req, res) => {
  const project = await Project.findByPk(req.params.id);
  if (!project) return res.status(404).json({ message: "Projet introuvable." });

  const data = parseProjectData(req.body, req.file);
  await project.update(data);
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
