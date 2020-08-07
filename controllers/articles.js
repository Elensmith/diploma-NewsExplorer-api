const Article = require("../models/articles");
const NotFound = require("../errors/notFound");
const BadRequest = require("../errors/badRequest");
const Forbidden = require("../errors/forbidden");
const {
  notFoundArticle,
  forbiddenDelete,
  validationError,
} = require("../constants/errorText");

module.exports.getArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .then((articles) => res.send({ data: articles }))
    .catch(next);
};

module.exports.deleteArticleById = (req, res, next) => {
  Article.findById(req.params.id)
    .select("+owner")
    .then((article) => {
      if (article === null) {
        return next(new NotFound(notFoundArticle));
      }
      if (article.owner.toString() !== req.user._id.toString()) {
        return Promise.reject(new Forbidden(forbiddenDelete));
      }
      return Article.deleteOne(article)
        .then(() => res.send(article))
        .catch(next);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  Article.create({
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
    owner: req.user._id,
  })
    .then((article) => {
      res.send({ data: article });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return Promise.reject(new BadRequest(validationError));
      }
      return next(err);
    });
};
