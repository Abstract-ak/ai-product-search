const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const { getOverview } = require("../controllers/dashboardController");

// Only SUPER_ADMIN
router.get(
  "/overview",
  authMiddleware,
  roleMiddleware(["SUPER_ADMIN"]),
  getOverview,
);

module.exports = router;
