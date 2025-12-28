import express from "express";
import {
  createArticle,
  deleteArticle,
  getAllArticles,
  getArticleById,
  updateArticle,
} from "../controllers/article.controller.js";

const articleRouter = express.Router();

articleRouter.route("/article").post(createArticle).get(getAllArticles);
articleRouter
  .route("/article/:id")
  .get(getArticleById)
  .patch(updateArticle)
  .delete(deleteArticle);

export default articleRouter;
