const Product = require("../models/product")
const Cart = require("../models/cart")
const CartItem = require("../models/cart-item")
const Order = require("../models/order")
const OrderItems = require("../models/order-items")

class shopController {
    async getAllProducts(req,res) {
        const products = await Product.findAll()
        console.log(products)
        res.status(201).json({
            products: products
        })
    }

    async getCart(req,res) {
        const userCart = await req.user.getCart()
        console.log(userCart)
        const cartProducts = await userCart.getProducts()
        res.status(201).json({
            products: cartProducts
        })
    }

    async addItemToCart(req,res) {
        const { productId, quantity }= req.body

        if (!productId || !quantity ) {
            return res.status(400).json({ error: "Product ID or quantity missing"})
        }
        const userCart = await req.user.getCart()
        const cartProducts = await userCart.getProducts({where: {id: productId}})
        
        if (cartProducts.length > 0) {
            const existingProduct = cartProducts[0]
            existingProduct.quantity += quantity
            await existingProduct.save()
            return res.status(200).json({ message: "updated quantity", cartItem: existingProduct})
        } else {
            const newProduct = await Product.findByPk(productId)
            const newCartItem = await userCart.addProduct(newProduct, {through: {quantity: quantity}})
            return res.status(201).json({message: "item added to cart", cartItem: newCartItem})
        }
    }

    async removeItemFromCart(req,res) {
        const { productId }= req.body

        if (!productId) {
            return res.status(400).json({ error: "Product ID missing"})
        }
        const userCart = await req.user.getCart()
        const cartProducts = await userCart.getProducts({where: {id: productId}})
        
        if (cartProducts.length > 0) {
            const existingProduct = cartProducts[0]
            await userCart.removeProduct(existingProduct)

            return res.status(200).json({ message: "removed from cart"})
        } else {
            return res.status(400).json({message: "product not in cart"})
        }
    }

    async orderItems(req, res) {
        const userId = req.user.id
        const userCart = await req.user.getCart()
        const cartItems = await userCart.getProducts({ attributes: ['id'], through: { attributes: ['quantity'] } })
    
        if (!cartItems.length) {
            return res.status(400).json({ error: "your cart has no items in it" })
        }
    
        const orderItems = cartItems.map(cartItem => {
            return {
                productId: cartItem.id,
                quantity: cartItem.CartItem ? cartItem.CartItem.quantity : 0
            }
        })
    
        const newOrder = await Order.create({ userId })
    
        for (const item of orderItems) {
            await OrderItems.create({ orderId: newOrder.id, ...item })
        }
    
        return res.status(201).json({ message: "order created successfully", newOrder })
    }
    

    async viewOrderedItems(req, res) {
        const userId = req.user.id;
    
        const orderedItems = await Order.findAll({
            where: { userId },
            include: [{
                model: OrderItems,
                as: "orderItems",
                include: [{
                    model: Product,
                    as: "product",
                    attributes: ["id", "title"]
                }]
            }]
        });
    
        res.status(201).json({ orders: orderedItems });
    }
    
}

module.exports = new shopController()