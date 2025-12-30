import { formatDate, getSourceBadge, stripHtml } from "../utils/helpers";

/**
 * A React component that displays an article card with its title, excerpt, and some metadata.
 *
 * @param {{ article: Article, onClick: Function }} props
 * @returns {JSX.Element}
 */
export const ArticleCard = ({ article, onClick }) => {
  const cleanText = stripHtml(article.content);
  const excerpt =
    cleanText.length > 150 ? cleanText.substring(0, 150) + "..." : cleanText;

  return (
    <article
      onClick={onClick}
      className="bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-6 cursor-pointer border border-gray-700 hover:border-gray-600"
    >
      <div className="flex items-center gap-2 mb-3">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${getSourceBadge(
            article.source
          )}`}
        >
          {article.source}
        </span>
        {article.publishedAt && (
          <span className="text-xs text-gray-400">
            {formatDate(article.publishedAt)}
          </span>
        )}
      </div>

      <h2 className="text-xl font-semibold text-gray-100 mb-3 line-clamp-2">
        {article.title}
      </h2>

      <p className="text-gray-300 text-sm mb-4 line-clamp-3">{excerpt}</p>

      <div className="flex items-center justify-between pt-4 border-t border-gray-700">
        <span className="text-sm text-gray-400">By {article.author}</span>
        <span className="text-sm font-medium text-blue-400 hover:text-blue-300">
          Read more →
        </span>
      </div>
    </article>
  );
};
