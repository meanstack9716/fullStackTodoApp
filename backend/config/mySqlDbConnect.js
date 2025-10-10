const { Sequelize } = require("sequelize");
const sequelize = new Sequelize("todoApp", "root", "", {
  host: "localhost",
  dialect: "mysql",
  logging: console.log,
});

const dbConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

module.exports = { dbConnection, sequelize };
