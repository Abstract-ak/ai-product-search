const { searchProducts } = require("../services/searchService");

exports.search = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ message: "Query is required" });
    }

    const results = await searchProducts(q);

    if (!results.length) {
      return res.json({
        message: "No products found",
        data: [],
      });
    }

    res.json({
      count: results.length,
      data: results,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
