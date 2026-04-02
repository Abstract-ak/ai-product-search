module.exports = function parseQuery(query, options = {}) {
  const q = String(query || "").toLowerCase();
  const availableCategories = Array.isArray(options.categories)
    ? options.categories.map((c) => String(c).toLowerCase())
    : [];
  const availableColors = Array.isArray(options.colors)
    ? options.colors.map((c) => String(c).toLowerCase())
    : [];

  let maxPrice = null;
  let category = null;
  let color = null;

  // Extract price: "under 50000", "below 50000", "less than 50000"
  const priceMatch = q.match(/\b(?:under|below|less\s+than)\s+(\d+)\b/);
  if (priceMatch) {
    maxPrice = Number.parseInt(priceMatch[1], 10);
  }

  // Category: match any category name from DB
  category = availableCategories.find((cat) => cat && q.includes(cat)) || null;

  // Color: match any distinct color from DB
  color = availableColors.find((c) => c && q.includes(c)) || null;

  // Keyword: remove recognized filter tokens, keep remaining words
  let keyword = q;
  if (maxPrice !== null) {
    keyword = keyword.replace(/\b(?:under|below|less\s+than)\s+\d+\b/g, " ");
  }
  if (category) {
    keyword = keyword.replace(
      new RegExp(`\\b${escapeRegExp(category)}\\b`, "g"),
      " ",
    );
  }
  if (color) {
    keyword = keyword.replace(
      new RegExp(`\\b${escapeRegExp(color)}\\b`, "g"),
      " ",
    );
  }

  keyword = keyword.replace(/\s+/g, " ").trim();
  // Ignore generic stopwords as keywords
  const stopwords = [
    "cheap",
    "best",
    "buy",
    "find",
    "show",
    "get",
    "search",
    "top",
    "latest",
    "new",
    "old",
  ];
  if (!keyword || stopwords.includes(keyword)) keyword = null;

  return {
    maxPrice,
    category,
    color,
    keyword,
  };
};

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
