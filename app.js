const express = require("express");

const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { mongoUrl, PORT } = require("./constants/config");

mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const app = express();
const { log } = console;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require("./routes")(app);

app.listen(PORT, () => {
  log("App is listening to port ", PORT);
});
