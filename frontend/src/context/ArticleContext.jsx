import { createContext, useContext, useEffect, useState } from "react";
import {
  createArticleApi,
  deleteArticleApi,
  fetchArticleByIdApi,
  fetchArticlesApi,
  updateArticleApi,
} from "../api/ArticleApi";

const ArticleContext = createContext();

/**
 * Hook to access the article context.
 * Returns an object containing the list of articles, a boolean indicating whether the articles are loading, and functions to create, update, fetch all, delete, and fetch an article by its ID.
 * Throws an error if used outside of ArticleProvider.
 * @returns {Object} - The article context
 * @throws {Error} - If used outside of ArticleProvider
 */
export const useArticles = () => {
  const context = useContext(ArticleContext);
  if (!context) {
    throw new Error("useArticles must be used within ArticleProvider");
  }
  return context;
};

/**
 * Provides the article context to its children.
 * The article context includes the list of articles, a boolean indicating whether the articles are loading, and functions to create, update, fetch all, delete, and fetch an article by its ID.
 * The fetchAllArticles function is called once when the component mounts.
 * @param {ReactNode} children - The children of the component.
 * @returns {ReactNode} - The article context provider component.
 */
export const ArticleProvider = ({ children }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const createArticle = async (articleData) => {
    try {
      setLoading(true);
      const data = await createArticleApi(articleData);
      setArticles((prevArticles) => [...prevArticles, data]);
      return data;
    } catch (error) {
      console.error("Error creating article:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Updates an article by its ID
   * @param {string} articleId - Article ID
   * @param {Object} articleData - Article data
   * @returns {Promise<Object>} - Updated article data
   * @throws {Error} - Error updating article
   */
  const updateArticle = async (articleId, articleData) => {
    try {
      setLoading(true);
      const data = await updateArticleApi(articleId, articleData);
      setArticles((prevArticles) =>
        prevArticles.map((article) =>
          article._id === articleId ? data : article
        )
      );
      return data;
    } catch (error) {
      console.error("Error updating article:", error);
    } finally {
      setLoading(false);
    }
  };

/**
 * Fetches all articles from the server and updates the state with the new data.
 * Sets the loading state to true before fetching the articles and sets it to false after the operation is complete.
 * If an error occurs, logs the error to the console.
 */
  const fetchArticles = async () => {
    try {
      setLoading(true);
      const data = await fetchArticlesApi();
      setArticles(data.articles);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Deletes an article by its ID
   * @param {string} articleId - Article ID
   * @throws {Error} - Error deleting article
   */
  const deleteArticle = async (articleId) => {
    try {
      setLoading(true);
      await deleteArticleApi(articleId);
      setArticles((prevArticles) =>
        prevArticles.filter((article) => article._id !== articleId)
      );
    } catch (error) {
      console.error("Error deleting article:", error);
    } finally {
      setLoading(false);
    }
  };

/**
 * Fetches an article by its ID
 * @param {string} articleId - Article ID
 * @returns {Promise<Object>} - Article data
 * @throws {Error} - Error fetching article by ID
 */
  const fetchArticleById = async (articleId) => {
    try {
      setLoading(true);
      const data = await fetchArticleByIdApi(articleId);
      return data;
    } catch (error) {
      console.error("Error fetching article by ID:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const value = {
    articles,
    loading,
    createArticle,
    updateArticle,
    fetchArticles,
    deleteArticle,
    fetchArticleById,
  };

  return (
    <ArticleContext.Provider value={value}>{children}</ArticleContext.Provider>
  );
};
