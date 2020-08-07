const { serverError } = require("../constants/errorText");

module.exports.mainError = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? serverError : message,
  });
  next();
};
