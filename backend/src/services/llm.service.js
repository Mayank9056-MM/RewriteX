import "dotenv/config";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

function normalizeLLMInput(originalArticle, referenceArticles) {
  return {
    originalContent:
      typeof originalArticle?.content === "string"
        ? originalArticle.content
        : "",

    references: referenceArticles
      .filter((r) => typeof r === "string")
      .slice(0, 2),
  };
}

function buildUserPrompt(original, refs) {
  return `
ORIGINAL ARTICLE:
${original}

REFERENCE ARTICLE 1:
${refs[0] || ""}

REFERENCE ARTICLE 2:
${refs[1] || ""}
`;
}

/**
 * Extracts the JSON object from the provided text by removing markdown code fences.
 * Throws an error if no JSON object is found in the LLM output.
 */
function extractJSON(text) {
  // Remove markdown code fences if present
  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start === -1 || end === -1) {
    throw new Error("No JSON object found in LLM output");
  }

  return cleaned.slice(start, end + 1);
}

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
                        Do not explain your reasoning.

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

                        You MUST return ONLY a valid JSON object.
                        DO NOT wrap output in markdown.
                        DO NOT include `````` markers.
                        DO NOT include explanations.
                        DO NOT include trailing commas.
                        `;

    const { originalContent, references } = normalizeLLMInput(
      originalArticle,
      referenceArticles
    );

    if (!originalContent || references.length < 2) {
      throw new Error("Invalid LLM input data");
    }

    const userPrompt = buildUserPrompt(originalContent, references);

    const completion = await client.chat.completions.create({
      model: "gemini-2.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
    });

    const raw = completion.choices[0].message.content;

    console.log("🧠 LLM rewrite completed");
    console.log(raw);

    let parsed;
    try {
      const jsonString = extractJSON(raw);
      parsed = JSON.parse(jsonString);
    } catch (error) {
      console.error("Raw LLM output:\n", raw);
      console.log(error);
      throw new Error("LLM output is not valid JSON");
    }
    return parsed;
  } catch (error) {
    console.error("❌ LLM rewrite failed:", error.message);
    throw error;
  }
}
