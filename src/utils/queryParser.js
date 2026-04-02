module.exports = function parseQuery(query, options = {}) {
  const q = String(query || "").toLowerCase();
  const availableCategories = Array.isArray(options.categories)
    ? options.categories.map((c) => String(c).toLowerCase())
    : [];
  const availableColors = Array.isArray(options.colors)
    ? options.colors.map((c) => String(c).toLowerCase())
    : [];

  let minPrice = null;
  let maxPrice = null;
  let category = null;
  let color = null;

  // Extract price ranges: "between 10000 and 30000"
  const betweenMatch = q.match(
    /\bbetween\s+(\d+(?:\.\d+)?[kKmM]?)\s+and\s+(\d+(?:\.\d+)?[kKmM]?)\b/,
  );
  if (betweenMatch) {
    minPrice = parseNumber(betweenMatch[1]);
    maxPrice = parseNumber(betweenMatch[2]);
  }

  // Extract max price: "under 50000", "below 50k", "less than 50000"
  const maxMatch = q.match(
    /\b(?:under|below|less\s+than)\s+(\d+(?:\.\d+)?[kKmM]?)\b/,
  );
  if (maxMatch) {
    maxPrice = parseNumber(maxMatch[1]);
  }

  // Extract min price: "above 10000", "over 10k", "more than 5000"
  const minMatch = q.match(
    /\b(?:above|over|more\s+than|greater\s+than)\s+(\d+(?:\.\d+)?[kKmM]?)\b/,
  );
  if (minMatch) {
    minPrice = parseNumber(minMatch[1]);
  }

  // Category: match any category name from DB
  category = availableCategories.find((cat) => cat && q.includes(cat)) || null;

  // Color: match any distinct color from DB
  color = availableColors.find((c) => c && q.includes(c)) || null;

  // Keyword: remove recognized filter tokens, keep remaining words
  let keyword = q;
  if (minPrice !== null || maxPrice !== null) {
    keyword = keyword.replace(
      /\b(?:under|below|less\s+than|above|over|more\s+than|greater\s+than)\s+\d+(?:\.\d+)?[kKmM]?\b/g,
      " ",
    );
    keyword = keyword.replace(
      /\bbetween\s+\d+(?:\.\d+)?[kKmM]?\s+and\s+\d+(?:\.\d+)?[kKmM]?\b/g,
      " ",
    );
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
    minPrice,
    maxPrice,
    category,
    color,
    keyword,
  };
};

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parseNumber(value) {
  const text = String(value).toLowerCase();
  const suffix =
    text.endsWith("k") || text.endsWith("m") ? text.slice(-1) : null;
  const num = Number.parseFloat(suffix ? text.slice(0, -1) : text);

  if (Number.isNaN(num)) return null;
  if (suffix === "k") return Math.round(num * 1000);
  if (suffix === "m") return Math.round(num * 1000000);
  return Math.round(num);
}
