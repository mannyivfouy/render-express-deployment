const Products = require("../models/products.model");
const Categories = require("../models/categories.model");
const path = require("path");
const fs = require("fs");
const { resolveSoa } = require("dns");

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Products.find().populate("category", "categoryName");
    res
      .status(200)
      .json({ message: "Get All Products Successfully", products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Products.findById(req.params.id).populate(
      "category",
      "categoryName"
    );
    if (!product) {
      res.status(404).json({ message: "Product Not Found" });
    }
    res.status(200).json({ message: "Get Product Successfully", product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    let imagePath = "/uploads/products/default.png";
    if (req.file) {
      imagePath = "/uploads/products/" + req.file.filename;
    }

    const category = await Categories.findById(req.body.category);
    if (!category) {
      res.status(404).json({ message: "Category Not Found" });
    }
    let productStatus = req.body.status ?? true;
    if (!category.status) {
      productStatus = false;
    }
    const product = new Products({
      productName: req.body.productName,
      price: req.body.price,
      stock: req.body.stock,
      category: req.body.category,
      status: productStatus,
      description: req.body.description,
      productImage: imagePath,
      createDate: Date.now(),
    });
    await product.save();
    res.status(201).json({ message: "Product Created", product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProductById = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Products.findById(id);

    if (!product) {
      res.status(404).json({ message: "Product Not Found" });
    }
    const category = await Categories.findById(
      req.body.category || product.category
    );
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    let productImage = product.productImage;
    if (req.file) {
      if (product.productImage !== "/uploads/products/default.png") {
        const oldImagePath = path.join(__dirname, "..", product.productImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      productImage = `/uploads/products/${req.file.filename}`;
    }
    product.productName = req.body.productName || product.productName;
    product.price = req.body.price || product.price;
    product.stock = req.body.stock || product.stock;
    product.amount = product.price * product.stock;
    product.category = req.body.category || product.category;

    if (req.body.status !== undefined) {
      product.status = category.status ? req.body.status : false;
    }

    product.description = req.body.description || product.description;
    product.productImage = productImage;

    await product.save();
    res.status(200).json({ message: "Product Updated Successfully", product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteProductById = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Products.findById(id);
    if (!product) {
      res.status(404).json({ message: "Product Not Found" });
    }
    await Products.findByIdAndDelete(id);
    res.status(200).json({ message: "Product Deleted Successfully", product });

    if (product.productImage !== "/uploads/products/default.png") {
      const imagePath = path.join(__dirname, "..", product.productImage);

      fs.unlink(imagePath, (err) => {
        if (err) console.error("Failed To Delete Image", err);
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
