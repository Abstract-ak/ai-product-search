const { Product, Category } = require("../models");

exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProducts = async (req, res) => {
  const products = await Product.findAll({ include: Category });
  res.json(products);
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;

  await Product.update(req.body, { where: { id } });

  res.json({ message: "Product updated" });
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  await Product.destroy({ where: { id } });

  res.json({ message: "Product deleted" });
};
