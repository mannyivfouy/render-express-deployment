const express = require("express");
const router = express.Router();
const { productUpload } = require("../middlewares/uploads.middleware");
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProductById,
  deleteProductById,
} = require("../controllers/products.controller");

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", productUpload.single("productImage"), createProduct);
router.put("/:id", productUpload.single("productImage"), updateProductById);
router.delete("/:id", deleteProductById);

module.exports = router;
