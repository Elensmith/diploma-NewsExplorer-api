const jwt = require("jsonwebtoken");

const { NODE_ENV, JWT_SECRET } = process.env;
const Unauthorized = require("../errors/unauthorized");
const { needAuth } = require("../constants/errorText");
const { devKey } = require("../constants/config");

const handleAuthError = () => {
  throw new Unauthorized(needAuth);
};

const extractBearerToken = (header) => header.replace("Bearer ", "");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return handleAuthError(res);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === "production" ? JWT_SECRET : devKey,
    );
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload;

  return next();
};
