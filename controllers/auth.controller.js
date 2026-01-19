const Users = require("../models/users.model");

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await Users.findOne({ username });

    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid Username or Password" });
    }

    return res.json({
      message: "Login Successful",
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        userImage: user.userImage,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { fullname, username, email, password } = req.body;
    const existing = await Users.findOne({ username });

    if (existing) {
      return res.status(400).json({ message: "Username Already Exists" });
    }

    const user = await Users.create({
      fullname,
      username,
      email,
      password,
    });

    res.status(201).json({
      message: "User Register Successful",
      user: {
        id: user._id,
        fullname: user.fullname,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
