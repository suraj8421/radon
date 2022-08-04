const cartModel = require("../models/cartModel")
const orderModel = require("../models/orderModel")
const ObjectId = require('mongoose').Types.ObjectId

const createOrder = async function (req, res) {
    try {
        let body = req.body;
        let user = req.params.userId;
        let { cartId, cancellable, status } = body

        if (!ObjectId.isValid(cartId)) return res.status(400).send({ status: false, message: "cart Id is invalid" })
        if (!ObjectId.isValid(user)) return res.status(400).send({ status: false, message: "User Id is invalid" })


        let cart = await cartModel.findOne({ _id: cartId })

        if (cart.items.length === 0) return res.status(400).send({ status: false, message: "No product added in your cart. Please add product before ordering" })
        if (!cart) return res.status(400).send({ status: false, message: "cart not exist" })
        if (user != cart.userId) { return res.status(400).send({ status: false, message: "user not found" }) }
        if ("cancellable" in body) {
            if (!["true", "false"].includes(cancellable)) return res.status(400).send({ status: false, message: "cancellable should be only true or false" })
        }
        if ("status" in body) {
            if (!["pending", "completed", "cancelled"].includes(status)) return res.status(400).send({ status: false, message: "status should be [pending, completed, cancelled]" })
        }
        let total = 0;
        for (let i = 0; i < cart.items.length; i++) {
            total += cart.items[i].quantity;
        }
        let order = {
            userId: user.toString(),
            items: cart.items,
            totalPrice: cart.totalPrice,
            totalItems: cart.totalItems,
            totalQuantity: total,
            cancellable: cancellable,
            status: status
        }
        let create = await orderModel.create(order)
        return res.status(200).send({ status: true, message: "order created successfully", data: create })
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}
module.exports = { createOrder }