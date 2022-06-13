const orderModel= require("../models/orderModel")
const productModel = require("../models/productModel")
const userModel = require("../models/userModel")

const createOrder= async function (req, res) {
    console.log("my first order");
    let order= req.body
    let userIdd = order.userId
    let productIdd = order.productId

    if(!userIdd) return res.send("UserId Must Be Present");

    let user = await userModel.findById(userIdd)
    if(!user) return res.send('The request is not valid as no user is present with the given user id')

    if(!productIdd) return res.send("ProductId Must Be Present");

    let product = await productModel.findById(productIdd)
    if(!product) return res.send("The request is not valid as no product is present with the given product id")

    let orderCreated = await orderModel.create(order);
    console.log(orderCreated)
    let value = req.headers["isFreeAppUser"]
    if (value == "true") {
        let customer = await orderModel.findOneAndUpdate(
            { userId: userIdd },
            { $set: { amount: 0, isFreeAppUser: true } },
            { $new: true }

        )
        return res.send({ data: customer })

    }
    else {

        let userBalance = await userModel.findById(userIdd)
        let productAmount = await productModel.findById(productIdd)
        let pay = userBalance.balance - productAmount.price
        if (pay >= 0) {
            let customerOrder = await orderModel.findOneAndUpdate(
                { userId: userIdd },
                { $set: { amount: productAmount.price, isFreeAppUser: true} },
                { $new: true }

            )
            let customer = await userModel.findOneAndUpdate(
                { _id: userIdd },
                { $set: { balance: pay, isFreeAppUser: true } },
                { $new: true }

            )
            let result = {}
            result.order = customerOrder
            result.user = customer

            return res.send({ data: result })
        } else {
            return res.send({ msg: "insufficient balance" })
        }

    }

};

module.exports.createOrder = createOrder