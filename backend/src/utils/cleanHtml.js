import sanitizeHtml from "sanitize-html";

export function cleanHtml(html) {
  if (!html || typeof html !== "string") return "";

  return sanitizeHtml(html, {
    allowedTags: [
      "h1", "h2", "h3",
      "p", "ul", "ol", "li",
      "strong", "em", "b", "i",
      "a", "blockquote", "code", "pre"
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"]
    },
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", {
        rel: "noopener noreferrer",
        target: "_blank"
      })
    }
  });
}
