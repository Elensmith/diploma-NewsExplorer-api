const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { NODE_ENV, JWT_SECRET } = process.env;
const User = require("../models/users");
const NotFound = require("../errors/notFound");
const Conflict = require("../errors/conflict");
const { userDoesntExists, emailExists } = require("../constants/errorText");
const { devKey } = require("../constants/config");

const whitelist = [
  "http://localhost:8080",
  "https://elensmith.github.io/diploma-NewsExplorer-frontend",
  "https://api.elena-k.tk",
  "http://api.elena-k.tk",
  "https://elena-k.tk",
  "http://elena-k.tk",
];

module.exports.getUserById = (req, res, next) => {
  if (whitelist.indexOf(req.headers.origin) > -1) {
    res.set("Access-Control-Allow-Credentials", "true");
    res.set("Access-Control-Allow-Origin", req.headers.origin);
  }
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return Promise.reject(new NotFound(userDoesntExists));
      }
      return res.send({ name: user.name, email: user.email });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  if (whitelist.indexOf(req.headers.origin) > -1) {
    res.set("Access-Control-Allow-Credentials", "true");
    res.set("Access-Control-Allow-Origin", req.headers.origin);
  }
  const { name, email, password } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    User.create({
      email,
      password: hash,
      name,
    })
      .then(() => {
        res.send({
          email,
          name,
        });
      })

      .catch((err) => {
        if (err.name === "MongoError" || err.code === 11000) {
          return next(new Conflict(emailExists));
        }
        return next(err);
      });
  });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === "production" ? JWT_SECRET : devKey,
      );
      res.send({ token });
    })
    .catch((err) => {
      next(err);
    });
};
