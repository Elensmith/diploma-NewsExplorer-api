const express = require("express");

const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const { DB_ADRESS, PORT } = require("./constants/config");
const { limiter } = require("./middlewares/rateLimiter");
const { requestLogger, errorLogger } = require("./middlewares/logger");

// const whitelist = [
//   "http://localhost:8080",
//   "https://elensmith.github.io/diploma-NewsExplorer-frontend",
//   "https://api.elena-k.tk",
//   "http://api.elena-k.tk",
//   "https://elena-k.tk",
//   "http://elena-k.tk",
// ];
// const corsOptions = {
//   origin(origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
// };

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
// app.use(cors(corsOptions));
app.use(cors());
app.use(helmet());
app.use(limiter);
app.use(requestLogger);
require("./routes")(app);

app.use(errorLogger);
app.listen(PORT, () => {
  log("App is listening to port ", PORT);
});
