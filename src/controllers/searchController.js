const { searchProducts } = require("../services/searchService");

exports.search = async (req, res) => {
  try {
    const { q } = req.query;
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      100,
      Math.max(1, Number.parseInt(req.query.limit, 10) || 10),
    );
    const offset = (page - 1) * limit;

    if (!q) {
      return res.status(400).json({ message: "Query is required" });
    }

    const results = await searchProducts(q, { limit, offset });

    if (!results.rows.length) {
      return res.json({
        message: "No products found",
        count: 0,
        page,
        limit,
        data: [],
      });
    }

    res.json({
      count: results.count,
      page,
      limit,
      data: results.rows,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
