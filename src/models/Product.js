const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Product = sequelize.define("Product", {
  name: DataTypes.STRING,
  price: DataTypes.FLOAT,
  color: DataTypes.STRING,
  description: DataTypes.TEXT,
  tags: DataTypes.STRING,
});

module.exports = Product;
