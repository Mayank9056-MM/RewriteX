import { formatDate, getSourceBadge } from "../utils/helpers";
import { useArticles } from "../context/ArticleContext";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import FullPageLoader from "../components/Loader";

/**
 * A page that displays an article by its ID.
 * If the article is not found, it displays a message.
 * If the article is loading, it displays a full-page loader.
 * If the article is found, it displays the article details.
 */
const ArticleDetails = () => {
  const navigate = useNavigate();
  const { fetchArticleById, loading } = useArticles();
  const { id } = useParams();
  const [selectedArticle, setSelectedArticle] = useState({});

  useEffect(() => {
    const getArticle = async () => {
      try {
        const article = await fetchArticleById(id);
        setSelectedArticle(article);
      } catch (error) {
        console.error("Error fetching article by ID:", error);
      }
    };

    getArticle();
  }, [id]);

  if (loading) {
    return <FullPageLoader />;
  }

  if (!selectedArticle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <p className="text-gray-400">Article not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 shadow-lg border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center text-blue-400 hover:text-blue-300 mb-4 font-medium transition-colors"
          >
            ← Back to articles
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="bg-gray-800 rounded-lg shadow-lg p-8 md:p-12 border border-gray-700">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${getSourceBadge(
                selectedArticle.source
              )}`}
            >
              {selectedArticle.source}
            </span>
            {selectedArticle.publishedAt && (
              <span className="text-sm text-gray-400">
                {formatDate(selectedArticle.publishedAt)}
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">
            {selectedArticle.title}
          </h1>

          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center">
                <span className="text-blue-300 font-semibold">
                  {selectedArticle.author?.charAt(0)}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-100">
                  {selectedArticle.author}
                </p>
                <p className="text-xs text-gray-400">Author</p>
              </div>
            </div>
          </div>

          <div
            className="prose prose-lg max-w-none text-gray-300"
            dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
          />

          {selectedArticle.sourceUrl && (
            <div className="mt-8 pt-8 border-t border-gray-700">
              <h3 className="text-sm font-semibold text-gray-100 mb-2">
                Source
              </h3>
              <a
                href={selectedArticle.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 text-sm break-all transition-colors"
              >
                {selectedArticle.sourceUrl}
              </a>
            </div>
          )}

          {selectedArticle.references &&
            selectedArticle.references.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-100 mb-3">
                  References
                </h3>
                <ul className="space-y-2">
                  {selectedArticle.references.map((ref, index) => (
                    <li key={index}>
                      <a
                        href={ref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 text-sm break-all transition-colors"
                      >
                        {ref}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </article>
      </main>
    </div>
  );
};

export default ArticleDetails;
