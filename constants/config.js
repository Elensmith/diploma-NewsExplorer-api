require("dotenv").config();

const production = process.env.NODE_ENV === "production";

const DB_ADRESS = production
  ? process.env.DB_ADRESS
  : "mongodb://localhost:27017/newsexplorer";

module.exports = {
  PORT: 3000,
  devKey: "dev-secret",
  DB_ADRESS,
};
