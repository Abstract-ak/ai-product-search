const { Product, Category } = require("../models");
const { Op } = require("sequelize");
const parseQuery = require("../utils/queryParser");

exports.searchProducts = async (query) => {
  const parsed = parseQuery(query);

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
