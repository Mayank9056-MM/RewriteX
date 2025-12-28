import "dotenv/config";
import axios from "axios";
import * as cheerio from "cheerio";
import mongoose from "mongoose";
import connectDB from "../db/db.js";

const BASE_URL = "https://beyondchats.com/blogs/";

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
  } catch (error) {
    console.error("Scraper error:", error.message);
  } finally {
    mongoose.connection.close();
  }
}

scrapeBeyondChats();
