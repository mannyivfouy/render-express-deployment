const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  dateOfBirth: { type: String, default: null },
  gender: { type: String, default: null },
  address: { type: String, default: null },
  email: { type: String, require: true },
  phone: { type: String, default: null },
  role: { type: String, default: "User" },
  userImage: { type: String, default: "/uploads/users/default.png" },
  createDate: { type: Date, dafault: Date.now },
});

module.exports = mongoose.model("Users", userSchema);
