const express = require("express");
const auth = require("../middleware/auth");
const { uploadProjectImage } = require("../middleware/upload");
const projectController = require("../controllers/projectController");
const skillController = require("../controllers/skillController");
const experienceController = require("../controllers/experienceController");
const educationController = require("../controllers/educationController");
const certificationController = require("../controllers/certificationController");
const messageController = require("../controllers/messageController");
const settingController = require("../controllers/settingController");
const dashboardController = require("../controllers/dashboardController");
const { uploadCV, uploadProfileImage } = require("../middleware/upload");

const router = express.Router();

router.use(auth);

router.get("/dashboard", dashboardController.getStats);

router.get("/projects", projectController.getAdminAll);
router.get("/projects/:id", projectController.getAdminById);
router.post("/projects", uploadProjectImage.single("image"), projectController.create);
router.put("/projects/:id", uploadProjectImage.single("image"), projectController.update);
router.patch("/projects/:id/archive", projectController.archive);
router.delete("/projects/:id", projectController.remove);

router.get("/skills", skillController.getAll);
router.post("/skills", skillController.create);
router.put("/skills/:id", skillController.update);
router.delete("/skills/:id", skillController.remove);

router.get("/experiences", experienceController.getAll);
router.post("/experiences", experienceController.create);
router.put("/experiences/:id", experienceController.update);
router.delete("/experiences/:id", experienceController.remove);

router.get("/educations", educationController.getAll);
router.post("/educations", educationController.create);
router.put("/educations/:id", educationController.update);
router.delete("/educations/:id", educationController.remove);

router.get("/certifications", certificationController.getAll);
router.post("/certifications", certificationController.create);
router.put("/certifications/:id", certificationController.update);
router.delete("/certifications/:id", certificationController.remove);

router.get("/messages", messageController.getAll);
router.patch("/messages/:id/read", messageController.markAsRead);
router.delete("/messages/:id", messageController.remove);

router.get("/settings", settingController.getAll);
router.put("/settings", settingController.update);
router.post("/settings/cv", uploadCV.single("cv"), settingController.uploadCV);
router.post(
  "/settings/profile-photo",
  uploadProfileImage.single("photo"),
  settingController.uploadProfile
);
router.post(
  "/settings/about-photo",
  uploadProfileImage.single("photo"),
  settingController.uploadAboutPhoto
);

module.exports = router;
