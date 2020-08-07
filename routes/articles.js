const articlesRouter = require("express").Router();

const {
  getArticles,
  deleteArticleById,
  createArticle,
} = require("../controllers/articles");
const {
  createArticleCheck,
  deleteArticleByIdChech,
} = require("../middlewares/validationJoi");

articlesRouter.get("/", getArticles);
articlesRouter.post("/", createArticleCheck, createArticle);
articlesRouter.delete("/:id", deleteArticleByIdChech, deleteArticleById);

module.exports = articlesRouter;
