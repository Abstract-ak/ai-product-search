const sequelize = require("../config/db");

const User = require("./User");
const Category = require("./Category");
const Product = require("./Product");

// Associations
Category.hasMany(Product, { foreignKey: "category_id" });
Product.belongsTo(Category, { foreignKey: "category_id" });

module.exports = {
  sequelize,
  User,
  Category,
  Product,
};
