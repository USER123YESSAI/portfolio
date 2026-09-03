const {
  Project,
  Skill,
  Experience,
  Education,
  Certification,
  Message,
} = require("../models");
const asyncHandler = require("../utils/asyncHandler");

const getStats = asyncHandler(async (_req, res) => {
  const [projects, skills, experiences, educations, certifications, messages, unreadMessages] =
    await Promise.all([
      Project.count({ where: { archive: false } }),
      Skill.count(),
      Experience.count(),
      Education.count(),
      Certification.count(),
      Message.count(),
      Message.count({ where: { statut_lu: false } }),
    ]);

  res.json({
    projects,
    skills,
    experiences,
    educations,
    certifications,
    messages,
    unreadMessages,
  });
});

module.exports = { getStats };
