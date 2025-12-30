import axios from "axios";
import * as cheerio from "cheerio";

/**
 * Scrapes the content of an external article.
 * This function takes a URL as an argument and returns the content of the article.
 * It uses a set of heuristics to determine which HTML element contains the article content.
 * The content is then filtered to exclude any text that is too short or contains certain keywords.
 * @param {string} url - URL of the external article to scrape
 * @returns {string} - Content of the scraped article, or an empty string if scraping failed
 */
export default async function scrapeExternalArticle(url) {
  try {
    console.log("🌐 Scraping external article:", url);

    const { data } = await axios.get(url, {
      timeout: 15000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; RewriteXBot/1.0; +https://example.com)",
      },
    });

    const $ = cheerio.load(data);

    $("script, style, nav, footer, header, iframe").remove();

    let contentContainer;

    if ($("article").length) {
      contentContainer = $("article").first();
    } else if ($("main").length) {
      contentContainer = $("main").first();
    } else if ($(".post-content").length) {
      contentContainer = $(".post-content").first();
    } else if ($(".article-content").length) {
      contentContainer = $(".article-content").first();
    } else if ($(".content").length) {
      contentContainer = $(".content").first();
    } else {
      contentContainer = $("body");
    }

    const content = contentContainer
      .find("p, h1, h2, h3, h4, ul, ol, li")
      .map((_, el) => $(el).text().trim())
      .get()
      .filter(
        (text) =>
          text.length > 40 &&
          !text.toLowerCase().includes("cookie") &&
          !text.toLowerCase().includes("subscribe")
      )
      .join("\n\n");

    console.log("Extracted content length:", content.length);

    if (!content || content.length < 200) {
      console.log("⚠️ Content too short — skipping");
      return "";
    }

    console.log(content.slice(0, 200) + "...");
    console.log("✅ Successfully scraped external article");

    return content;
  } catch (error) {
    console.error("❌ Failed to scrape external article:", url);
    console.error(error.message);
    return "";
  }
}

