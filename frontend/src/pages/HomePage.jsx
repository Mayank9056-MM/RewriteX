import { useArticles } from "../context/ArticleContext";
import { useNavigate } from "react-router-dom";
import { ArticleCard } from "../components/ArticleCard";
import FullPageLoader from "../components/Loader";

/**
 * A page that displays a list of articles.
 * If no articles are available, it displays a message.
 * If articles are loading, it displays a full-page loader.
 * If articles are found, it displays a grid of article cards.
 */
const Homepage = () => {
  const { articles, loading } = useArticles();

  const navigate = useNavigate();

  if (loading) {
    return <FullPageLoader />;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 shadow-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-100">Articles</h1>
          <p className="mt-2 text-gray-400">
            Explore our collection of insightful articles
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {articles?.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No articles available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles?.map((article) => (
              <ArticleCard
                key={article._id}
                article={article}
                onClick={() => navigate(`/article/${article._id}`)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Homepage;
