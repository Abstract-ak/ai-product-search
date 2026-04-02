const { User, Product, Category } = require("../models");

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

    const results = await Product.findAndCountAll({
      include: Category,
      limit,
      offset,
      distinct: true,
    });

    res.json({
      count: results.count,
      page,
      limit,
      data: results.rows,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
