const Categories = require("../models/categories.model");
const Products = require("../models/products.model");

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Categories.find();
    res
      .status(200)
      .json({ message: "Get All Categories Successfully", categories });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await Categories.findById(req.params.id);
    if (!category) {
      res.status(404).json({ message: "Category Not Found" });
    }
    res.status(200).json({ message: "Get Category Successfully", category });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const category = new Categories({
      categoryName: req.body.categoryName,
      description: req.body.description,
      status: req.body.status,
      createDate: Date.now(),
    });
    await category.save();
    res.status(201).json({ message: "Category Created", category });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateCategoryById = async (req, res) => {
  try {
    const id = req.params.id;
    const category = await Categories.findById(id);

    if (!category) {
      res.status(404).json({ message: "Category Not Found" });
    }
    category.categoryName = req.body.categoryName || category.categoryName;
    category.description = req.body.description || category.description;
    category.status = req.body.status ?? category.status;

    await category.save();

    if (category.status === false) {
      await Products.updateMany({ category: category._id }, { status: false });
    }

    if (category.status === true) {
      await Products.updateMany({ category: category._id }, { status: true });
    }
    res
      .status(200)
      .json({ message: "Category Updated Successfully", category });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteCategoryById = async (req, res) => {
  try {
    const id = req.params.id;
    const category = await Categories.findById(id);
    if (!category) {
      res.status(404).json({ message: "Category Not Found" });
    }
    await Categories.findByIdAndDelete(id);
    res
      .status(200)
      .json({ message: "Category Deleted Successfully", category });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
