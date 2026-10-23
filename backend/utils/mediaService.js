const fs = require("fs");
const path = require("path");
const { Media } = require("../models");

/**
 * Sauvegarde un fichier uploadé dans la base de données MySQL (table Media)
 * pour garantir une persistance 100% permanente même après redémarrage de Render.
 */
const persistUploadedFile = async (file, folder) => {
  if (!file || !file.filename || !file.path) return;

  try {
    if (fs.existsSync(file.path)) {
      const buffer = fs.readFileSync(file.path);
      const base64Data = buffer.toString("base64");
      await Media.upsert({
        filename: file.filename,
        folder,
        mimetype: file.mimetype || "application/octet-stream",
        data: base64Data,
      });
      console.log(`[MediaService] Fichier sauvegardé en base de données : ${folder}/${file.filename}`);
    }
  } catch (error) {
    console.error(`[MediaService] Erreur lors de la persistance de ${file.filename} en BDD :`, error);
  }
};

/**
 * Restaure un fichier sur le disque local depuis la BDD s'il a été effacé par Render.
 */
const restoreMediaFromDB = async (folder, filename) => {
  try {
    const media = await Media.findOne({ where: { filename } });
    if (!media || !media.data) return null;

    const buffer = Buffer.from(media.data, "base64");
    const localDir = path.join(__dirname, "..", "uploads", folder);
    const localPath = path.join(localDir, filename);

    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true });
    }

    fs.writeFileSync(localPath, buffer);
    console.log(`[MediaService] Fichier restauré sur le disque depuis la BDD : ${folder}/${filename}`);

    return { buffer, mimetype: media.mimetype };
  } catch (error) {
    console.error(`[MediaService] Erreur lors de la restauration de ${filename} :`, error);
    return null;
  }
};

/**
 * Synchronise les fichiers déjà présents sur le disque vers la BDD MySQL au démarrage.
 */
const syncDiskUploadsToDB = async () => {
  const uploadsBase = path.join(__dirname, "..", "uploads");
  const folders = ["profile", "projects", "cv"];

  for (const folder of folders) {
    const folderPath = path.join(uploadsBase, folder);
    if (!fs.existsSync(folderPath)) continue;

    const files = fs.readdirSync(folderPath);
    for (const filename of files) {
      if (filename.startsWith(".") || filename === ".gitkeep") continue;

      const filePath = path.join(folderPath, filename);
      const stat = fs.statSync(filePath);
      if (!stat.isFile()) continue;

      try {
        const existing = await Media.findOne({ where: { filename } });
        if (!existing) {
          const buffer = fs.readFileSync(filePath);
          const ext = path.extname(filename).toLowerCase();
          let mimetype = "application/octet-stream";
          if (ext === ".jpg" || ext === ".jpeg") mimetype = "image/jpeg";
          else if (ext === ".png") mimetype = "image/png";
          else if (ext === ".webp") mimetype = "image/webp";
          else if (ext === ".pdf") mimetype = "application/pdf";

          await Media.create({
            filename,
            folder,
            mimetype,
            data: buffer.toString("base64"),
          });
          console.log(`[MediaService] Sync initiale vers BDD : ${folder}/${filename}`);
        }
      } catch (err) {
        // Ignorer les doublons ou petites erreurs de sync au démarrage
      }
    }
  }
};

module.exports = {
  persistUploadedFile,
  restoreMediaFromDB,
  syncDiskUploadsToDB,
};
