const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// Admin only
router.post("/", authMiddleware, roleMiddleware(["ADMIN"]), createProduct);
router.put("/:id", authMiddleware, roleMiddleware(["ADMIN"]), updateProduct);
router.delete("/:id", authMiddleware, roleMiddleware(["ADMIN"]), deleteProduct);

// Accessible to all logged-in users
router.get("/", authMiddleware, getProducts);

module.exports = router;
