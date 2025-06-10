const Product = require("../models/product");

class productController {
  async getAllProducts(req, res) {
    const products = await Product.findAll();
    console.log(products);
    res.status(201).json({
      products: products,
    });
  }
  async getProductById(req, res) {
    const products = await Product.findByPk(req.params.id);
    console.log(products);
    res.status(201).json({
      products: products,
    });
  }
}

module.exports = new productController();
