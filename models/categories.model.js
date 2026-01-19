const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  categoryName: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: Boolean, required: true },
  createDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Categories", categorySchema);
