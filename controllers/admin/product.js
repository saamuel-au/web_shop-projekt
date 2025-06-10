const Product = require("../../models/product");

class adminController {
  async addProduct(req, res) {
    const product = await Product.create({
      title: req.body.title,
      price: req.body.price,
      imageUrl: req.body.imageUrl,
      description: req.body.description,
      userId: req.user.id
    });
    res.status(201).json({
      message: "product is added",
      productId: product.id,
    });
  }
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
  async updateProductById(req, res) {
    const products = await Product.findByPk(req.params.id);
    console.log(products);
    res.status(201).json({
      products: products,
    });
  }
  async updateBook(req, res) {
    if (req.method == "POST") {
      let title = req.body.title;
      let price = req.body.price;
      let imageUrl = req.body.imageUrl;
      let description = req.body.description;
  
      const updatedBook = Product.update(
        {
          title: title,
          price: price,
          imageUrl: imageUrl,
          description: description
        },
        {
          where: {
            id: req.params.id,
          },
        }
      )
        .then((product) => {
          console.log(product);
          return res.status(200).json({ message: "Updated book" });
        })
        .catch((error) => {
          return res.status(500).send(error.message);
        });
    } else if (req.method == "GET") {
        const products = await Product.findByPk(req.params.id);
        console.log(products);
        res.status(201).json({
          products: products,
        });
    } else if (req.method == "DELETE") {
      Product.destroy({
        where: {
          id: req.params.id,
        },
      })
        .then((product) => {
          return res.status(200).json({ message: "Deleted book" });
        })
        .catch((error) => {
          return res.status(500).send(error.message);
        });
    }
  };
}

module.exports = new adminController();
