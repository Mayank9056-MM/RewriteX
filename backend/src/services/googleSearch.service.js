import "dotenv/config";
import axios from "axios";

const SERP_API_KEY = process.env.SERP_API_KEY;

console.log("Using SERP_API_KEY:", SERP_API_KEY);

/**
 * Domains that are JS-heavy, docs, or not suitable for scraping
 */
const DOMAIN_BLACKLIST = [
  "nodejs.org",
  "medium.com",
  "dev.to",
  "github.com",
  "stackoverflow.com",
  "npmjs.com",
  "youtube.com",
  "reddit.com",
  "twitter.com",
  "linkedin.com",
  "beyondchats.com",
  "fabcomlive.com"
];

/**
 * Domains that usually contain static blog content
 */
const DOMAIN_WHITELIST = [
  "blog",
  "marketing",
  "insights",
  "resources",
  "articles",
];

/**
 * Checks if a URL is blacklisted, i.e., if it contains any of the domains in DOMAIN_BLACKLIST.
 * @param {string} url - URL to check
 * @returns {boolean} - True if URL is blacklisted, false otherwise
 */
function isBlacklisted(url) {
  return DOMAIN_BLACKLIST.some((domain) => url.includes(domain));
}

/**
 * Checks if a URL looks like it belongs to a blog or article page.
 * This function returns true if the URL contains any of the keywords in DOMAIN_WHITELIST,
 * or if the URL has more than 4 parts (to avoid home/listing pages).
 * @param {string} url - URL to check
 * @returns {boolean} - True if URL looks like a blog/article page, false otherwise
 */
function looksLikeArticle(url) {
  return (
    url.includes("/blog") ||
    url.includes("/blogs") ||
    url.includes("/article") ||
    url.includes("/posts") ||
    url.split("/").length > 4 // avoids home/listing pages
  );
}

/**
 * Returns a score of 1 if the URL contains any of the keywords in DOMAIN_WHITELIST,
 * indicating that it is more likely to be a blog/article page.
 * Returns 0 otherwise.
 * @param {string} url - URL to score
 * @returns {number} - Score of the URL
 */
function domainScore(url) {
  return DOMAIN_WHITELIST.some((kw) => url.includes(kw)) ? 1 : 0;
}

/**
 * Searches Google for relevant articles to a given title.
 * @param {string} title - Title to search for
 * @returns {Promise<string[]>} - Array of filtered Google search results
 */
export default async function searchGoogle(title) {
  try {
    console.log("🔍 Google search for:", title);

    const response = await axios.get("https://serpapi.com/search", {
      params: {
        q: `${title} blog article`,
        engine: "google",
        api_key: SERP_API_KEY,
        num: 10,
      },
    });

    const organicResults = response.data.organic_results || [];

    const filteredLinks = organicResults
      .map((r) => r.link)
      .filter(Boolean)
      .filter((link) => !link.endsWith(".pdf"))
      .filter((link) => !isBlacklisted(link))
      .filter((link) => looksLikeArticle(link))
      .map((link) => ({
        link,
        score: domainScore(link),
      }))
      // Prefer better domains
      .sort((a, b) => b.score - a.score)
      .slice(0, 2)
      .map((item) => item.link);

    console.log("✅ Filtered Google results:", filteredLinks);

    return filteredLinks;
  } catch (error) {
    console.error("❌ Google search failed:", error.message);
    return [];
  }
}
