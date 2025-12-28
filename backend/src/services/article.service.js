import Article from "../models/article.model.js";

/**
 * Creates a new article
 * @param {Object} data - Article data
 * @returns {Promise<Object>} - Created article
 * @throws {Error} - Original article not found if originalArticleId is provided and the article is not found
 */
const createArticle = async (data) => {
  if (data.originalArticleId) {
    const original = await Article.findById(data.originalArticleId);
    if (!original) {
      const error = new Error("Original article not found");
      error.statusCode = 400;
      throw error;
    }
  }

  return await Article.create(data);
};

/**
 * Gets all articles sorted by createdAt in descending order
 * @returns {Promise<Array<Object>>} - Array of article objects
 */
const getAllArticles = async () => {
  return await Article.find().sort({ createdAt: -1 });
};

/**
 * Gets an article by its ID
 * @param {string} id - Article ID
 * @throws {Error} - Article not found
 * @returns {Promise<Object>} - Article data
 */
const getArticleById = async (id) => {
  const article = await Article.findById(id);

  if (!article) {
    const error = new Error("Article not found");
    error.statusCode = 404;
    throw error;
  }

  return article;
};

/**
 * Updates an article by its ID
 * @param {string} id - Article ID
 * @param {Object} data - Article data
 * @returns {Promise<Object>} - Updated article data
 * @throws {Error} - Article not found
 */
const updateArticle = async (id, data) => {
  const article = await Article.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!article) {
    const error = new Error("Article not found");
    error.statusCode = 404;
    throw error;
  }

  return article;
};

/**
 * Deletes an article by its ID
 * @param {string} id - Article ID
 * @returns {Promise<Object>} - Deleted article data
 * @throws {Error} - Article not found
 */
const deleteArticle = async (id) => {
  const article = await Article.findByIdAndDelete(id);

  if (!article) {
    const error = new Error("Article not found");
    error.statusCode = 404;
    throw error;
  }

  return article;
};

export default {
  createArticle,
  getAllArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
};
