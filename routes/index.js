const { errors } = require("celebrate");
const helmet = require("helmet");
const auth = require("../middlewares/auth");
const usersRouter = require("./users");
const articlesRouter = require("./articles");
const NotFound = require("../errors/notFound");
const { pageNotFound } = require("../constants/errorText");
const { mainError } = require("../middlewares/mainError");
const { createUser, login } = require("../controllers/users");
const { requestLogger, errorLogger } = require("../middlewares/logger");
const { limiter } = require("../middlewares/rateLimiter");
const { signupCheck, signinCheck } = require("../middlewares/validationJoi");

module.exports = function (app) {
  app.use(helmet());
  app.use(limiter);
  app.use(requestLogger);
  app.post("/signup", signupCheck, createUser);
  app.post("/signin", signinCheck, login);
  app.use("/users", auth, usersRouter);
  app.use("/articles", auth, articlesRouter);
  app.use((req, res, next) => {
    next(new NotFound(pageNotFound));
  });
  app.use(errorLogger);
  app.use(errors());
  app.use(mainError);
};
