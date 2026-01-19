const Users = require("../models/users.model");
const path = require("path");
const fs = require("fs");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await Users.find().select("-password");
    res.status(200).json({ message: "Get All Users Successfully", users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await Users.findById(req.params.id).select("-password");
    if (!user) {
      res.status(404).json({ message: "User Not Found" });
    }
    res.status(200).json({ message: "Get User Successfully", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    let imagePath = "/uploads/users/default.png";
    if (req.file) {
      imagePath = "/uploads/users/" + req.file.filename;
    }
    const user = new Users({
      fullname: req.body.fullname,
      username: req.body.username,
      password: req.body.password,
      dateOfBirth: req.body.dateOfBirth,
      gender: req.body.gender,
      address: req.body.address,
      email: req.body.email,
      phone: req.body.phone,
      role: req.body.role,
      userImage: imagePath,
      createDate: Date.now(),
    });
    await user.save();
    res.status(201).json({ message: "User Created", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await Users.findById(id);

    if (!user) {
      res.status(404).json({ message: "User Not Found" });
    }
    let userImage = user.userImage;
    if (req.file) {
      if (user.userImage !== "/uploads/users/default.png") {
        const oldImagePath = path.join(__dirname, "..", user.userImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      userImage = `/uploads/users/${req.file.filename}`;
    }
    user.fullname = req.body.fullname || user.fullname;
    user.username = req.body.username || user.username;
    user.password = req.body.password || user.password;
    user.dateOfBirth = req.body.dateOfBirth || user.dateOfBirth;
    user.gender = req.body.gender || user.gender;
    user.address = req.body.address || user.address;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.role = req.body.role || user.role;
    user.userImage = userImage;

    await user.save();
    res.status(200).json({ message: "User Updated Successfully", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await Users.findById(id);
    if (!user) {
      res.status(404).json({ message: "User Not Found" });
    }
    await Users.findByIdAndDelete(id);
    res.status(200).json({ message: "User Deleted Successfully", user });

    if (user.userImage !== "/uploads/users/default.png") {
      const imagePath = path.join(__dirname, "..", user.userImage);

      fs.unlink(imagePath, (err) => {
        if (err) console.error("Failed To Delete Image", err);
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
