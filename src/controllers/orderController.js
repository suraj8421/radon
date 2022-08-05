const cartModel = require("../models/cartModel")
const orderModel = require("../models/orderModel")
const ObjectId = require('mongoose').Types.ObjectId
const { isValid, isValidBody } = require('../middleware/valid')


const createOrder = async function (req, res) {
    try {
        let body = req.body;
        let user = req.params.userId;
        let { cartId, cancellable, status } = body

        if (!isValidBody(body)) return res.status(400).send({ status: false, message: "Body cannot be empty" })
        if (!ObjectId.isValid(cartId)) return res.status(400).send({ status: false, message: "cart Id is invalid" })
        if (!ObjectId.isValid(user)) return res.status(400).send({ status: false, message: "User Id is invalid" })


        let cart = await cartModel.findOne({ _id: cartId })

        if (!cart) return res.status(404).send({ status: false, message: "cart not exist" })
        if (cart.items.length === 0) return res.status(400).send({ status: false, message: "Cart is empty. Please add product before ordering" })
        // if (user != cart.userId) { return res.status(400).send({ status: false, message: "user not found" }) }
        if ("cancellable" in body) {
            if (!["true", "false", true, false].includes(cancellable)) return res.status(400).send({ status: false, message: "cancellable should be only true or false" })
        }
        if ("status" in body) {
            if (!["pending", "completed"].includes(status)) return res.status(400).send({ status: false, message: "Cannot cancel order before placing. status should be [pending, completed]" })
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

        await cartModel.findOneAndUpdate({ userId: user },{ items: [], totalItems: 0, totalPrice: 0 })

        let respondData = { _id: create._id, userId: create.userId, items: create.items, totalPrice: create.totalPrice, totalItems: create.totalItems, totalQuantity: create.totalQuantity, cancellable: create.cancellable, status: create.status, createdAt: create.createdAt, updatedAt: create.updatedAt }
        return res.status(201).send({ status: true, message: "order created successfully", data: respondData })
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}



const updateOrder = async function (req, res) {
    try {
        let userId = req.params.userId;
        let data = req.body;
        let orderId = data.orderId
        let status = data.status

        if (!ObjectId.isValid(userId)) return res.status(400).send({ status: false, message: "User Id is invalid" })

        if (!Object.keys(data).length)
            return res.status(400).send({
                status: false,
                message: "Data is required to cancel your order",
            })

        if (!isValid(data.orderId))
            return res.status(400).send({
                status: false,
                message: "OrderId is required and should not be an empty string",
            })
        if (!ObjectId.isValid(orderId))
            return res.status(400).send({ status: false, message: "Enter a valid order-Id" })

        if ("status" in data) {
            if (!["cancelled", "completed"].includes(status)) return res.status(400).send({ status: false, message: "Cannot cancel order before placing. status should be [cancelled, completed]" })
        }else{
            status = "cancelled"
        }

        let findOrder = await orderModel.findOne({
            _id: orderId,
            isDeleted: false
        })

        
        if (!findOrder)
            return res.status(404).send({
                status: false,
                message: `No order found with this '${orderId}' order-ID`,
            })
        if (findOrder.status == "cancelled") return res.status(400).send({ status: false, message: "Order alreay cancelled" })
        if (!findOrder.cancellable) return res.status(400).send({ status: false, message: "You cannot cancel this order" })

        let orderUpdate = await orderModel.findOneAndUpdate({ _id: findOrder._id }, { status: status }, { new: true }).select({ isDeleted: 0, __v: 0 })
        return res.status(200).send({
            status: true,
            message: "Success",
            data: orderUpdate
        })

    } catch (err) {
        console.log(err);
        return res.status(500).send({ status: false, message: err.message })
    }
}



module.exports = { createOrder, updateOrder }