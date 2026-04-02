const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const searchRoutes = require("./routes/searchRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/search", searchRoutes);

app.get("/", (req, res) => {
  res.send("API Running...");
});

module.exports = app;
