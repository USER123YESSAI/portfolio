const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadsDir = path.join(__dirname, "../uploads");
const cvDir = path.join(uploadsDir, "cv");
const projectsDir = path.join(uploadsDir, "projects");
const profileDir = path.join(uploadsDir, "profile");

[uploadsDir, cvDir, projectsDir, profileDir].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const storage = (folder) =>
  multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, folder),
    filename: (_req, file, cb) => {
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${unique}${path.extname(path.basename(file.originalname))}`);
    },
  });

const fileFilter = (allowed) => (_req, file, cb) => {
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Type de fichier non autorisé."), false);
  }
};

const uploadCV = multer({
  storage: storage(cvDir),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter(["application/pdf"]),
});

const uploadProjectImage = multer({
  storage: storage(projectsDir),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter(["image/jpeg", "image/png", "image/webp", "image/gif"]),
});

const uploadProfileImage = multer({
  storage: storage(profileDir),
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter: fileFilter(["image/jpeg", "image/png", "image/webp"]),
});

module.exports = { uploadCV, uploadProjectImage, uploadProfileImage, uploadsDir };
