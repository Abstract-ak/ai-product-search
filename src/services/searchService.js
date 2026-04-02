const { Product, Category, sequelize } = require("../models");
const { Op } = require("sequelize");
const parseQuery = require("../utils/queryParser");

exports.searchProducts = async (query) => {
  const categories = await Category.findAll({ attributes: ["name"] });
  const categoryNames = categories.map((c) => c.name).filter(Boolean);

  const colorRows = await Product.findAll({
    attributes: [[sequelize.fn("DISTINCT", sequelize.col("color")), "color"]],
    raw: true,
  });
  const colorNames = colorRows
    .map((row) => row.color)
    .filter((c) => typeof c === "string" && c.trim().length > 0);

  const parsed = parseQuery(query, {
    categories: categoryNames,
    colors: colorNames,
  });

  const where = {};

  // Price filter
  if (parsed.maxPrice) {
    where.price = { [Op.lte]: parsed.maxPrice };
  }

  // Color filter
  if (parsed.color) {
    where.color = parsed.color;
  }

  // Keyword (name/description)
  if (parsed.keyword) {
    where[Op.or] = [
      { name: { [Op.like]: `%${parsed.keyword}%` } },
      { description: { [Op.like]: `%${parsed.keyword}%` } },
    ];
  }

  const results = await Product.findAll({
    where,
    include: [
      {
        model: Category,
        where: parsed.category
          ? { name: { [Op.like]: `%${parsed.category}%` } }
          : undefined,
      },
    ],
  });

  return results;
};
