require("dotenv").config();
const { sequelize } = require("../models");
const { runSeed } = require("./seedRunner");

const main = async () => {
  try {
    await sequelize.sync();
    await runSeed();
    process.exit(0);
  } catch (error) {
    console.error("Erreur lors du seed :", error);
    process.exit(1);
  }
};

main();
