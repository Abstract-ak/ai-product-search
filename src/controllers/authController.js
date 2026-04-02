const bcrypt = require("bcrypt");
const { User } = require("../models");
const { generateToken } = require("../utils/jwt");
const { logError } = require("../utils/logger");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const safeUser = user.toJSON();
    delete safeUser.password;

    return res.status(201).json(safeUser);
  } catch (error) {
    if (error?.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ message: "Email already registered" });
    }
    logError("Register error", error);
    return res.status(500).json({ message: "Failed to register user" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(400).json({ message: "Wrong password" });

    const token = generateToken(user);

    const safeUser = user.toJSON();
    delete safeUser.password;

    return res.json({ token, user: safeUser });
  } catch (error) {
    logError("Login error", error);
    return res.status(500).json({ message: "Failed to login" });
  }
};
