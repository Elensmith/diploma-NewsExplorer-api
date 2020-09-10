const { errors } = require("celebrate");

const cors = require("cors");

const auth = require("../middlewares/auth");
const usersRouter = require("./users");
const articlesRouter = require("./articles");
const NotFound = require("../errors/notFound");
const { pageNotFound } = require("../constants/errorText");
const { mainError } = require("../middlewares/mainError");
const { createUser, login } = require("../controllers/users");

const { signupCheck, signinCheck } = require("../middlewares/validationJoi");

const whitelist = [
  "http://localhost:8080",
  "https://elensmith.github.io/diploma-NewsExplorer-frontend",
  "https://api.elena-k.tk",
  "http://api.elena-k.tk",
  "https://elena-k.tk",
  "http://elena-k.tk",
];
const corsOptions = {
  origin(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

module.exports = function (app) {
  app.post("/signup", cors(corsOptions), signupCheck, createUser);
  app.post("/signin", cors(corsOptions), signinCheck, login);
  app.use("/users", cors(corsOptions), auth, usersRouter);
  app.use("/articles", cors(corsOptions), auth, articlesRouter);
  app.use((req, res, next) => {
    next(new NotFound(pageNotFound));
  });

  app.use(errors());
  app.use(mainError);
};
