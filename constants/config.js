const mongoUrl = "mongodb://localhost:27017/newsexplorer";
const { PORT = 3000 } = process.env;

module.exports = {
  mongoUrl,
  PORT,
};
