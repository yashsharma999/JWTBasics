const CustomAPIError = require("../errors/custom-error");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new CustomAPIError("Please provide username and password", 400);
  }

  const id = new Date().getTime();
  const token = jwt.sign({ id, username }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.status(200).json({ msg: "user created", token });
};

const dashboard = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new CustomAPIError("Please provide token", 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
  } catch (error) {
    throw new CustomAPIError("Invalid token", 401);
  }

  const luckyNumber = Math.floor(Math.random() * 100);
  res.status(200).json({
    msg: "Hello John Doe",
    secret: `Your lucky number is ${luckyNumber}`,
  });
};

module.exports = {
  login,
  dashboard,
};
