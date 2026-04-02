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
    const products = await Product.findAll({ include: Category });
    res.json({ count: products.length, data: products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
