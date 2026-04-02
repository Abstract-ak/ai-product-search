const bcrypt = require("bcrypt");
const { sequelize, User, Category, Product } = require("../models");

const seed = async () => {
  await sequelize.sync({ force: true });

  // Users (roles)
  const defaultPassword = "Password@123";
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  await User.bulkCreate([
    {
      name: "Super Admin",
      email: "superadmin@test.com",
      password: hashedPassword,
      role: "SUPER_ADMIN",
    },
    {
      name: "Admin",
      email: "admin@test.com",
      password: hashedPassword,
      role: "ADMIN",
    },
    {
      name: "Manager",
      email: "manager@test.com",
      password: hashedPassword,
      role: "MANAGER",
    },
    {
      name: "Employee",
      email: "employee@test.com",
      password: hashedPassword,
      role: "EMPLOYEE",
    },
    {
      name: "User",
      email: "user@test.com",
      password: hashedPassword,
      role: "USER",
    },
  ]);

  // Categories
  const categories = await Category.bulkCreate([
    { name: "laptop" },
    { name: "phone" },
    { name: "shoes" },
    { name: "watch" },
  ]);

  // Products (10+ realistic data)
  await Product.bulkCreate([
    {
      name: "Dell Inspiron Laptop",
      price: 48000,
      color: "black",
      category_id: categories[0].id,
      description: "Affordable laptop for students",
      tags: "laptop,dell,budget",
    },
    {
      name: "HP Pavilion Laptop",
      price: 55000,
      color: "silver",
      category_id: categories[0].id,
      description: "Performance laptop",
      tags: "laptop,hp,performance",
    },
    {
      name: "MacBook Air",
      price: 90000,
      color: "white",
      category_id: categories[0].id,
      description: "Premium Apple laptop",
      tags: "laptop,apple,premium",
    },
    {
      name: "iPhone 13",
      price: 70000,
      color: "black",
      category_id: categories[1].id,
      description: "High-end smartphone",
      tags: "phone,apple,premium",
    },
    {
      name: "Samsung Galaxy M32",
      price: 15000,
      color: "blue",
      category_id: categories[1].id,
      description: "Budget Android phone",
      tags: "phone,samsung,budget",
    },
    {
      name: "OnePlus Nord",
      price: 28000,
      color: "black",
      category_id: categories[1].id,
      description: "Mid-range performance phone",
      tags: "phone,oneplus,performance",
    },
    {
      name: "Nike Running Shoes",
      price: 2500,
      color: "red",
      category_id: categories[2].id,
      description: "Comfortable running shoes",
      tags: "shoes,nike,running",
    },
    {
      name: "Adidas Sneakers",
      price: 3000,
      color: "white",
      category_id: categories[2].id,
      description: "Stylish sneakers",
      tags: "shoes,adidas,casual",
    },
    {
      name: "Puma Sports Shoes",
      price: 2200,
      color: "black",
      category_id: categories[2].id,
      description: "Durable sports shoes",
      tags: "shoes,puma,sports",
    },
    {
      name: "Fastrack Watch",
      price: 1800,
      color: "black",
      category_id: categories[3].id,
      description: "Trendy wrist watch",
      tags: "watch,fastrack,casual",
    },
    {
      name: "Titan Smart Watch",
      price: 5000,
      color: "blue",
      category_id: categories[3].id,
      description: "Smart wearable watch",
      tags: "watch,titan,smart",
    },
  ]);

  console.log("✅ Database Seeded Successfully!");
  console.log(
    `Seed users created (password: ${defaultPassword}): superadmin@test.com, admin@test.com, manager@test.com, employee@test.com, user@test.com`,
  );
};

seed();
