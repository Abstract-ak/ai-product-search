module.exports = function parseQuery(query) {
  const q = query.toLowerCase();

  let maxPrice = null;
  let category = null;
  let color = null;
  let keyword = null;

  // 🎯 Extract price
  const priceMatch = q.match(/under (\d+)/);
  if (priceMatch) {
    maxPrice = parseInt(priceMatch[1]);
  }

  // 🎯 Categories (you can expand this)
  const categories = ["laptop", "phone", "shoes", "watch"];

  for (let cat of categories) {
    if (q.includes(cat)) {
      category = cat;
      break;
    }
  }

  // 🎯 Colors
  const colors = ["red", "blue", "black", "white"];

  for (let c of colors) {
    if (q.includes(c)) {
      color = c;
      break;
    }
  }

  // 🎯 Keyword fallback
  keyword = q;

  return {
    maxPrice,
    category,
    color,
    keyword,
  };
};
