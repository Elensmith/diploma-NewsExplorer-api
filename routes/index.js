const { celebrate, Joi, errors } = require("celebrate");
const auth = require("../middlewares/auth");
const usersRouter = require("./users");
const articlesRouter = require("./articles");
const NotFound = require("../errors/notFound");
const { mainError } = require("../middlewares/mainError");
const { createUser, login } = require("../controllers/users");
const { requestLogger, errorLogger } = require("../middlewares/logger");

module.exports = function (app) {
  app.use(requestLogger);
  app.use("/users", auth, usersRouter);
  app.post(
    "/signup",
    celebrate({
      body: Joi.object().keys({
        email: Joi.string()
          .email()
          .required()
          .error(new Error("Invalid email")),
        password: Joi.string().min(8).max(30).required(),
        name: Joi.string()
          .min(2)
          .max(30)
          .required()
          .error(new Error("Name mush be 2-30 characters long")),
      }),
    }),
    createUser,
  );
  app.post(
    "/signin",
    celebrate({
      body: Joi.object().keys({
        email: Joi.string()
          .email()
          .required()
          .error(new Error("Email is a required field!")),
        password: Joi.string().min(8).max(30).required(),
      }),
    }),
    login,
  );
  app.use("/articles", auth, articlesRouter);
  app.use((req, res, next) => {
    next(new NotFound("страница не найдена"));
  });
  app.use(errorLogger);
  app.use(errors());
  app.use(mainError);
};
