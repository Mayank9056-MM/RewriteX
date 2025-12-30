import "dotenv/config";
import connectDB from "../db/db.js";
import Article from "../models/article.model.js";
import searchGoogle from "../services/googleSearch.service.js";
import scrapeExternalArticle from "../services/scraper.service.js";
import rewriteWithLLM from "../services/llm.service.js";

/**
 * Rewrite job
 * This job fetches all articles from Beyond Chats, searches for relevant articles on Google,
 * scrapes them, and then rewrites the original article with the help of LLaMAI.
 * The rewritten article is then saved as a new article with the source set to "ai".
 * The original article is left untouched.
 */
async function rewriteJob() {
  console.log("\n🚀 Rewrite Job Started\n");
  await connectDB();

  const articles = await Article.find({ source: "beyondchats" });

  for (const article of articles) {
    try {
      console.log("📝 Processing:", article.title);

      const referenceLinks = await searchGoogle(article.title);
      if (referenceLinks.length < 2) continue;

      const referenceArticles = [];

      for (const link of referenceLinks) {
        const content = await scrapeExternalArticle(link);
        if (content) referenceArticles.push({ url: link, content });
      }

      if (referenceArticles.length < 2) continue;

      const rewritten = await rewriteWithLLM(article, referenceArticles);

      const finalContent = `
${rewritten.content}
<hr />
<h3>References</h3>
<ul>
  ${referenceLinks.map((l) => `<li><a href="${l}">${l}</a></li>`).join("")}
</ul>
`;

      await Article.create({
        title: rewritten.title || article.title,
        content: finalContent,
        source: "ai",
        author: "ai",
        originalArticleId: article._id,
        references: referenceLinks,
      });

      console.log("✅ AI article saved");
    } catch (err) {
      console.error("❌ Failed:", article.title, err.message);
    }
  }

  console.log("\n🏁 Rewrite Job Finished");
  process.exit(0);
}

rewriteJob();
