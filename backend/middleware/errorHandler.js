const multer = require("multer");

const errorHandler = (err, _req, res, _next) => {
  console.error(err);

  if (err.name === "SequelizeValidationError") {
    return res.status(400).json({
      message: "Erreur de validation.",
      errors: err.errors.map((e) => e.message),
    });
  }

  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(409).json({ message: "Cette ressource existe déjà." });
  }

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FIELD_VALUE") {
      return res.status(400).json({
        message: "Les données d'image envoyées dépassent la taille autorisée. Veuillez réduire la taille de vos fichiers.",
      });
    }
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "Le fichier envoyé est trop volumineux.",
      });
    }
    return res.status(400).json({ message: err.message });
  }

  res.status(err.status || 500).json({
    message: err.message || "Erreur interne du serveur.",
  });
};

module.exports = errorHandler;
