import mongoose from "mongoose";
import articleService from "../services/article.service.js";

/**
 * Creates a new article
 * @param {Object} req.body - Request body
 * @param {string} req.body.title - Article title
 * @param {string} req.body.content - Article content
 * @param {string} req.body.author - Article author
 * @param {string} req.body.source - Article source
 * @param {string[]} req.body.references - Article references
 * @param {string} req.body.originalArticleId - Original article ID
 * @returns {Promise<Object>} - Created article
 */
const createArticle = async (req, res, next) => {
  try {
    const { title, content, author, source, references, originalArticleId } =
      req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ success: false, message: "Title and Content are required" });
    }

    if (
      originalArticleId &&
      !mongoose.Types.ObjectId.isValid(originalArticleId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid originalArticleId",
      });
    }

    const article = await articleService.createArticle({
      title,
      content,
      author,
      source,
      references,
      originalArticleId,
    });

    if (!article) {
      throw new Error("Something went wrong while creating article");
    }

    res.status(201).json({
      success: true,
      message: "Article created successfully",
      data: article,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

/**
 * Gets all articles
 * @returns {Promise<Object>} - Response object with success, data and count
 */
const getAllArticles = async (req, res, next) => {
  try {
    const articles = await articleService.getAllArticles();

    res.status(200).json({
      success: true,
      data: { articles, count: articles.length },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Gets an article by its ID
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.id - Article ID
 * @returns {Promise<Object>} - Article data
 */
const getArticleById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid article id",
      });
    }

    const article = await articleService.getArticleById(id);

    res.status(200).json({
      success: true,
      data: article,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Updates an article by its ID
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.id - Article ID
 * @param {Object} req.body - Request body
 * @param {string} req.body.source - Article source, must be one of ["user", "ai", "beyondchats"]
 * @param {string} req.body.originalArticleId - Original article ID
 * @returns {Promise<Object>} - Updated article data
 * @throws {Error} - Article not found
 * @throws {Error} - Invalid article id
 * @throws {Error} - Invalid originalArticleId
 * @throws {Error} - Invalid source
 */
const updateArticle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { source, originalArticleId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid article id",
      });
    }

    if (
      originalArticleId &&
      !mongoose.Types.ObjectId.isValid(originalArticleId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid originalArticleId",
      });
    }

    if (source && !["user", "ai", "beyondchats"].includes(source)) {
      return res.status(400).json({
        success: false,
        message: "Invalid source",
      });
    }

    const updatedArticle = await articleService.updateArticle(id, req.body);

    res.status(200).json({
      success: true,
      message: "Article updated successfully",
      data: updatedArticle,
    });
  } catch (error) {
    next(error);
  }
};


/**
 * Deletes an article by its ID
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.id - Article ID
 * @returns {Promise<Object>} - Deleted article data
 * @throws {Error} - Article not found
 * @throws {Error} - Invalid article id
 */
const deleteArticle = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid article id",
      });
    }

    await articleService.getArticleById(id);

    const deleteAritcle = await articleService.deleteArticle(id);

    res.status(200).json({
      success: true,
      message: "Article deleted successfully",
      data: deleteAritcle,
    });
  } catch (error) {
    next(error);
  }
};

export {
  createArticle,
  getAllArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
};
