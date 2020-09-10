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

module.exports = function (app) {
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
      res.header(
        "Access-Control-Allow-Methods",
        "PUT, POST, PATCH, DELETE, GET"
      );
      return res.status(200).json({});
    }
    next();
  });
  app.post("/signup", signupCheck, createUser);
  app.post("/signin", signinCheck, login);
  app.use("/users", auth, usersRouter);
  app.use("/articles", auth, articlesRouter);
  app.use((req, res, next) => {
    next(new NotFound(pageNotFound));
  });

  app.use(errors());
  app.use(mainError);
};
