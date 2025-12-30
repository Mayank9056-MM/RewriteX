/**
 * Formats a date string into a human-readable date string in the format "Month Day, Year".
 * @param {string} dateString - The date string to format
 * @returns {string} The formatted date string
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Returns a Tailwind CSS class string that represents a badge for the given source.
 *
 * The badge colors are as follows:
 * - beyondchats: blue
 * - ai: purple
 * - user: green
 *
 * If the source is not recognized, the user badge is returned as the default.
 * @param {string} source - The source of the article (beyondchats, ai, or user)
 * @returns {string} - A Tailwind CSS class string representing the source badge
 */
export const getSourceBadge = (source) => {
  const badges = {
    beyondchats: "bg-blue-900 text-blue-300",
    ai: "bg-purple-900 text-purple-300",
    user: "bg-green-900 text-green-300",
  };
  return badges[source] || badges.user;
};

export const stripHtml = (html) => html.replace(/<[^>]*>?/gm, "");
