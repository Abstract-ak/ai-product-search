const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  getOverview,
  getProducts,
} = require("../controllers/dashboardController");

// Only SUPER_ADMIN
router.get(
  "/overview",
  authMiddleware,
  roleMiddleware(["SUPER_ADMIN"]),
  getOverview,
);

// Manager dashboard
router.get(
  "/products",
  authMiddleware,
  roleMiddleware(["MANAGER"]),
  getProducts,
);

module.exports = router;
