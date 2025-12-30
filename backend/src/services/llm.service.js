import "dotenv/config";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

/**
 * Rewrite an article using LLaMAI to improve clarity, structure, and SEO quality
 * @param {Object} originalArticle - Original article data
 * @param {string[]} referenceArticles - Reference article content
 * @returns {Promise<Object>} - Rewritten article data
 * @throws {Error} - LLM rewrite failed
 */
export default async function rewriteWithLLM(
  originalArticle,
  referenceArticles
) {
  try {
    const systemPrompt = `
You are an expert SEO content editor.
User will provide you with an original article and up to two reference articles.
reference articles are high-quality examples to guide your rewriting.
make your output superior to the original by leveraging the references.

Your job is to rewrite articles to improve clarity, structure, and SEO quality.
Follow instructions strictly and return only valid HTML.
You may include references ONLY in the JSON output when explicitly requested.
Do not explain your reasoning.
`;

    const userPrompt = `
ORIGINAL ARTICLE:
${originalArticle.content}

REFERENCE ARTICLE 1:
${referenceArticles[0]}

REFERENCE ARTICLE 2:
${referenceArticles[1]}

TASK:
- Improve structure and readability
- Use proper headings (h2, h3)
- Add bullet points where useful
- Expand explanations where helpful
- Preserve original meaning
- Do NOT plagiarize
- Keep tone professional and informative
- Add the reference article URLs to the references array.

OUTPUT FORMAT:
Return ONLY a valid JSON object with the following shape:

{
  "title": "string",
  "content": "string (HTML)",
  "source": "ai",
  "references": ["string"],
  "author": "ai"
}

Do NOT add any extra text.
Do NOT wrap in markdown.
`;

    const completion = await client.chat.completions.create({
      model: "gemini-2.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
    });

    const rewrittenContent = completion.choices[0].message.content;

    console.log("🧠 LLM rewrite completed");
    console.log(rewrittenContent);

    let parsed;

    try {
      parsed = JSON.parse(rewrittenContent);
    } catch (error) {
      throw new Error("LLM output is not valid JSON");
    }

    return parsed;
  } catch (error) {
    console.error("❌ LLM rewrite failed:", error.message);
    throw error;
  }
}