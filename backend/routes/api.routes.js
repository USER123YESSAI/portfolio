const express = require("express");
const projectController = require("../controllers/projectController");
const skillController = require("../controllers/skillController");
const experienceController = require("../controllers/experienceController");
const educationController = require("../controllers/educationController");
const certificationController = require("../controllers/certificationController");
const settingController = require("../controllers/settingController");
const contactController = require("../controllers/contactController");

const router = express.Router();

router.get("/projects", projectController.getAll);
router.get("/projects/:id", projectController.getById);
router.get("/skills", skillController.getAll);
router.get("/experiences", experienceController.getAll);
router.get("/educations", educationController.getAll);
router.get("/certifications", certificationController.getAll);
router.get("/settings", settingController.getAll);
router.post("/cv/verify", settingController.verifyCVPassword);
router.get("/cv/download", settingController.downloadCV);
router.post("/cv/download", settingController.downloadCV);
router.post("/contact", contactController.sendContact);

module.exports = router;
