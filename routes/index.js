const { errors } = require("celebrate");

// const cors = require("cors");

const auth = require("../middlewares/auth");
const usersRouter = require("./users");
const articlesRouter = require("./articles");
const NotFound = require("../errors/notFound");
const { pageNotFound } = require("../constants/errorText");
const { mainError } = require("../middlewares/mainError");
const { createUser, login } = require("../controllers/users");

const { signupCheck, signinCheck } = require("../middlewares/validationJoi");

// const whitelist = [
// "http://localhost:8080",
// "https://elensmith.github.io",
// "https://api.elena-k.tk",
// "http://api.elena-k.tk",
// "https://elena-k.tk",
// "http://elena-k.tk",
// ];

// const whitelist = ["http://localhost:8080",
//   "https://elensmith.github.io",
//   "https://api.elena-k.tk",
//   "http://api.elena-k.tk",
//   "https://elena-k.tk",
//   "http://elena-k.tk",]
// const corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// }
module.exports = function (app) {
  app.use((req, res, next) => {
    const origins = [
      "http://localhost:8080",
      "https://elensmith.github.io",
      "https://api.elena-k.tk",
      "http://api.elena-k.tk",
      "https://elena-k.tk",
      "http://elena-k.tk",
    ];

    for (let i = 0; i < origins.length; i++) {
      const origin = origins[i];

      if (req.headers.origin.indexOf(origin) > -1) {
        res.header("Access-Control-Allow-Origin", req.headers.origin);
      }
    }
    // res.set("Access-Control-Allow-Origin", "https://elensmith.github.io");

    // res.header("Access-Control-Allow-Origin", "*");
    res.set(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    );
    if (req.method === "OPTIONS") {
      res.set("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
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
