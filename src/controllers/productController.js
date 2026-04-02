const { Product, Category } = require("../models");
const cache = require("../utils/cache");

exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    await cache.clearPrefix("products:list:");
    await cache.clearPrefix("dashboard:products:");
    res.status(201).json(product);
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
    const cacheKey = `products:list:${page}:${limit}`;
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

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Product id is required" });

    const [updatedCount] = await Product.update(req.body, { where: { id } });
    if (updatedCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    await cache.clearPrefix("products:list:");
    await cache.clearPrefix("dashboard:products:");
    res.json({ message: "Product updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Product id is required" });

    const deletedCount = await Product.destroy({ where: { id } });
    if (deletedCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    await cache.clearPrefix("products:list:");
    await cache.clearPrefix("dashboard:products:");
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
