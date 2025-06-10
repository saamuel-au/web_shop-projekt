const express = require("express");
const router = express.Router();
const productController = require("../controllers/product");

router.get("/products", (req, res) =>
  productController.getAllProducts(req, res)
);
router.get("/products/product/:id", (req, res) =>
  productController.getProductById(req, res)
);

module.exports = router;
