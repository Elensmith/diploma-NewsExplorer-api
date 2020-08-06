const Article = require("../models/articles");
const NotFound = require("../errors/notFound");
const BadRequest = require("../errors/badRequest");
const Forbidden = require("../errors/forbidden");

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
        return next(new NotFound("Статьи не существует"));
      }
      if (article.owner.toString() !== req.user._id.toString()) {
        return Promise.reject(new Forbidden("Навозможно удалить чужую статью"));
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
      if (!article) {
        return Promise.reject(new BadRequest("Вы что-то не ввели"));
      }
      return res.send({ data: article });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return Promise.reject(new BadRequest("Что-то пошло не так"));
      }
      return next(new Error("Ошибка создания статьи"));
    });
};
