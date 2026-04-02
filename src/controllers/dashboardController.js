const { User, Product, Category } = require("../models");
const cache = require("../utils/cache");

exports.getOverview = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalProducts = await Product.count();
    const totalCategories = await Category.count();

    res.json({
      totalUsers,
      totalProducts,
      totalCategories,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      100,
      Math.max(1, Number.parseInt(req.query.limit, 10) || 10),
    );
    const offset = (page - 1) * limit;
    const cacheKey = `dashboard:products:${page}:${limit}`;
    const cached = await cache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const results = await Product.findAndCountAll({
      include: Category,
      limit,
      offset,
      distinct: true,
    });

    const payload = {
      count: results.count,
      page,
      limit,
      data: results.rows,
    };

    await cache.set(cacheKey, payload, 30000);
    res.json(payload);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
