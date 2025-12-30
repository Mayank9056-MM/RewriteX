import axios from "axios";
import { conf } from "../config/conf";

const axiosInstance = axios.create({
  baseURL: conf.apiUrl,
});

/**
 * Creates a new article
 * @param {Object} articleData - Article data
 * @returns {Promise<Object>} - Created article data
 * @throws {Error} - Error creating article
 */
export const createArticleApi = async (articleData) => {
  try {
    const response = await axiosInstance.post("/article", articleData);
    return response.data.data;
  } catch (error) {
    console.error("Error creating article:", error);
    throw error;
  }
};

/**
 * Updates an article by its ID
 * @param {string} articleId - Article ID
 * @param {Object} articleData - Article data
 * @returns {Promise<Object>} - Updated article data
 * @throws {Error} - Error updating article
 */
export const updateArticleApi = async (articleId, articleData) => {
  try {
    const response = await axiosInstance.put(
      `/article/${articleId}`,
      articleData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating article:", error);
    throw error;
  }
};

/**
 * Deletes an article by its ID
 * @param {string} articleId - Article ID
 * @returns {Promise<Object>} - Deleted article data
 * @throws {Error} - Error deleting article
 */
export const deleteArticleApi = async (articleId) => {
  try {
    const response = await axiosInstance.delete(`/articles/${articleId}`);
    return response.data.data;
  } catch (error) {
    console.error("Error deleting article:", error);
    throw error;
  }
};

/**
 * Fetches all articles from the server
 * @returns {Promise<Array<Object>>} - Array of article objects
 * @throws {Error} - Error fetching articles
 */
export const fetchArticlesApi = async () => {
  try {
    const response = await axiosInstance.get("/article");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching articles:", error);
    throw error;
  }
};

/**
 * Fetches an article by its ID from the server
 * @param {string} articleId - Article ID
 * @returns {Promise<Object>} - Article data
 * @throws {Error} - Error fetching article
 */
export const fetchArticleByIdApi = async (articleId) => {
  try {
    const response = await axiosInstance.get(`/article/${articleId}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching article:", error);
    throw error;
  }
};
