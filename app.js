const express = require("express");

const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const { DB_ADRESS, PORT } = require("./constants/config");
const { limiter } = require("./middlewares/rateLimiter");
const { requestLogger, errorLogger } = require("./middlewares/logger");

mongoose.connect(DB_ADRESS, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const app = express();
const { log } = console;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(limiter);
app.use(requestLogger);
app.use(cors());
require("./routes")(app);

app.use(errorLogger);
app.listen(PORT, () => {
  log("App is listening to port ", PORT);
});
