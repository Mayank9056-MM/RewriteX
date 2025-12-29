import "dotenv/config";
import axios from "axios";
import * as cheerio from "cheerio";
import mongoose from "mongoose";
import connectDB from "../db/db.js";
import Article from "../models/article.model.js";

const BASE_URL = "https://beyondchats.com/blogs/";

/**
 * Scrapes an article from Beyond Chats
 * @param {string} url - Article URL
 * @returns {Promise<Object>} - Scraped article data
 * @throws {Error} - Scraper error
 */
async function scrapeArticle(url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const title = $(".e-con-inner h1").first().text().trim();

    console.log("Title:", title);

    const author = $("li[itemprop='author'] span").first().text().trim();

    console.log("Author:", author);

    const publishedAtText = $("li[itemprop='datePublished'] time")
      .first()
      .text()
      .trim();

    const publishedAt = publishedAtText ? new Date(publishedAtText) : null;

    console.log("Published at:", publishedAt);

    const content = $(".elementor-widget-theme-post-content")
      .find("p, h2, h3, ul, ol, li")
      .map((_, el) => $(el).text().trim())
      .get()
      .filter((text) => text.length > 0)
      .join("\n\n");

    console.log("Content:", content.slice(0, 200), "...");

    return {
      title,
      content,
      author,
      publishedAt,
      sourceUrl: url,
      version: "original",
    };
  } catch (error) {
    console.error("Error scraping article:", error);
  }
}

/**
 * Scrapes articles from Beyond Chats
 * @returns {Promise<void>} - Scrape result
 * @throws {Error} - Scraper error
 */
async function scrapeBeyondChats() {
  try {
    await connectDB();
    console.log("DB connected");

    console.log("Scraper started...");

    const { data } = await axios.get(BASE_URL);
    const $ = cheerio.load(data);

    const pages = [];

    $(".page-numbers").each((_, el) => {
      const pageText = $(el).text().trim();

      if (!isNaN(pageText)) {
        pages.push(Number(pageText));
      }
    });

    const lastPage = Math.max(...pages);

    console.log("Last page is:", lastPage);

    const collectedLinks = [];
    let currPage = lastPage;

    while (currPage > 0 && collectedLinks.length < 5) {
      const pageUrl =
        currPage === 1
          ? "https://beyondchats.com/blogs/"
          : `https://beyondchats.com/blogs/page/${currPage}/`;

      console.log("Scraping:", pageUrl);

      const { data } = await axios.get(pageUrl);
      const $ = cheerio.load(data);

      $(".entry-title a").each((index, element) => {
        if (collectedLinks.length < 5) {
          const link = $(element).attr("href");

          console.log(index, link);

          if (link) {
            collectedLinks.push(link);
          }
        }
      });

      currPage--;
    }

    console.log("Oldest 5 articles:", collectedLinks);

    // saving to db
    for (const url of collectedLinks) {
      try {
        const articleData = await scrapeArticle(url);

        const exists = await Article.findOne({ sourceUrl: url });

        if (exists) {
          console.log("Skipping existing article");
          continue;
        }

        await Article.create({
          title: articleData.title,
          content: articleData.content,
          sourceUrl: articleData.sourceUrl,
          author: articleData.author,
          publishedAt: articleData.publishedAt,
          source: "beyondchats",
        });
        console.log("Saved:", articleData.title);
      } catch (err) {
        console.error("Error saving article:", err);
        console.error("Failed to scrape:", url);
      }
    }
  } catch (error) {
    console.error("Scraper error:", error);
  } finally {
    mongoose.connection.close();
  }
}

scrapeBeyondChats();
