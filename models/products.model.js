const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  amount: { type: Number },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Categories",
    required: true,
  },
  status: { type: Boolean, required: true },
  description: { type: String, required: true },
  productImage: { type: String, default: "uploads/products/default.png" },
  createDate: { type: Date, default: Date.now },
});

//! Auto Calculate Amount
productSchema.pre("save", function (next) {
  this.amount = this.price * this.stock;
  // next();
});

module.exports = mongoose.model("Products", productSchema);
