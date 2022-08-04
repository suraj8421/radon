let cartModel = require("../models/cartModel")
const ObjectId = require('mongoose').Types.ObjectId
const { isValid, isValidBody, positiveIntigerRegex, priceRegex } = require('../middleware/valid')
const productModel = require('../models/productModel')
const userModel = require("../models/userModel")





const createCart = async function (req, res) {
    try {
        let body = req.body
        let userId = req.params.userId
  
        let productId = body.productId
        let productQuantity = body.quantity

        ////////////////////////////////////////////// body validation //////////////////////////////////////////////////
        if (!isValidBody(body)) return res.status(400).send({ status: false, message: "Body cannot be empty" })

        /////////////////////////////////////////////// object id validation ///////////////////////////////////////////////
        if (!ObjectId.isValid(userId)) return res.status(400).send({ status: false, message: "Bad Request. userId invalid" })
        if (!ObjectId.isValid(productId)) return res.status(400).send({ status: false, message: "Bad Request. productId invalid" })

        /////////////////////////////////////////////////items validation /////////////////////////////////////////////////////////
    
        if ("quantity" in body){
            if (!isValid(productQuantity)) return res.status(400).send({ status: false, message: "product Quantity should be given" })
            if (!positiveIntigerRegex.test(productQuantity)) return res.status(400).send({ status: false, message: "Enter a valid quantity" })
        }else{
            productQuantity = 1
        }


        /////////////////////////////////////////////// validating product existance//////////////////////////////////////////////
        let productSearch = await productModel.findOne({ _id: productId, isDeleted: false })
        if (!productSearch) return res.status(400).send({ status: false, message: "product with this id is not available. please enter a valid product id" })


        let productPrice = productSearch.price

        let items = [{ productId: productId, quantity: productQuantity }]

        let cartSearch = await cartModel.findOne({ userId : userId})
        if(cartSearch){
          
            priceToAdd = productSearch.price * productQuantity
                        
            let updateCart = await cartModel.findOneAndUpdate({ userId: userId, "items.productId": productId }, { $inc: { "items.$.quantity": productQuantity, totalPrice: priceToAdd } }, { new: true }).select({ __v: 0, "items._id": 0 }).populate([{ path: "items.productId" }])
     
            if(updateCart == null){
                updateCart = await cartModel.findOneAndUpdate({ userId: userId }, { $addToSet: { items: items }, $inc: { totalPrice: priceToAdd, totalItems: 1 } }, { new: true }).select({ __v: 0, "items._id": 0 }).populate([{ path: "items.productId" }])
            }
            return res.send({ status: true, message: "Cart created successfully", data: updateCart })

        }else{
            let totalPrice = productPrice
            let totalItems = 1
            let newProductData = { userId, items, totalPrice, totalItems }
       
            let cartData = await cartModel.create(newProductData)
          
            let respondData = { _id: cartData._id, userId: cartData.userId, items: [{ productId: productSearch, quantity: cartData.items[0].quantity }], totalPrice: cartData.totalPrice, totalItems: cartData.totalItems, createdAt: cartData.createdAt, updatedAt: cartData.updatedAt }
            return res.status(201).send({ status: true, message: "Cart created successfully", data: respondData })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Server side Errors. Please try again later", error: error.message })
    }
}


const updateCart = async function (req, res) {
    try {
        let body = req.body;
        let userId = req.params.userId

        let { cartId, productId, removeProduct } = body
        removeProduct = Number(removeProduct)
        if (!isValidBody(body)) return res.status(400).send({ status: false, message: "Body should not be empty" })
        let findUser = await userModel.findById({ _id: userId })
        if (!findUser) return res.status(400).send({ status: false, message: "User not found" })
        
        if (!ObjectId.isValid(cartId)) return res.status(400).send({ status: false, message: "card Id is invalid" })
        const findCart = await cartModel.findOne({ _id: cartId })
        if (!findCart) return res.status(400).send({ status: false, message: "Cart id not exist" })

        if (!ObjectId.isValid(productId)) return res.status(400).send({ status: false, message: "product Id is invalid" })
        const findProduct = await productModel.findOne({ _id: productId, isDeleted: false })
        if (!findProduct) return res.status(400).send({ status: false, message: "product does not not exist" })

        if (!isValid(removeProduct)) return res.status(400).send({ status: false, message: "please enter your removeProduct" })

        if (![0, 1].includes(removeProduct)) return res.status(400).send({ status: false, message: "Remove product should be only in 0 or 1 " })

        for (let i = 0; i < findCart.items.length; i++) {
    
            if (findProduct._id.toString() == findCart.items[i].productId.toString()) {
                if (removeProduct == 1 && findCart.items[i].quantity > 1) {
                    let updateCart = await cartModel.findOneAndUpdate({ _id: cartId, "items.productId": productId }, { $inc: { "items.$.quantity": -1, totalPrice: -(findProduct.price) } }, { new: true }).select({ __v: 0, "items._id": 0 }).populate([{ path: "items.productId" }])
                    return res.status(200).send({ status: true, message: "cart updated successfully", data: updateCart })
                } else {
                    let updateCart = await cartModel.findOneAndUpdate({ _id: cartId }, { $pull: { items: { productId: productId } }, $inc: { totalItems: -1, totalPrice: -(findProduct.price * (findCart.items[i].quantity)) } }, { new: true }).select({ __v: 0, "items._id": 0 }).populate([{ path: "items.productId" }])
                    return res.status(200).send({ status: true, message: "removed successfully", data: updateCart })
                }
            }
        } return res.status(404).send({ status: false, message: "prodeuct not found" })

    } catch (err) {
        return res.status(500).send({ status: false, message: "There is an error inside of the code" })
    }
}


const getCart = async function (req, res) {
    try {

        let userId = req.params.userId
        if ((!ObjectId.isValid(userId))) {
            return res.status(400).send({ status: false, message: "Bad Request. userId  is invalid" })
        }

        let cart = await cartModel.findOne({ userId: userId }).select({ __v: 0, "items._id": 0 }).populate([{ path: "items.productId" }])
        if (!cart) return res.status(404).send({ status: false, message: "No such cart Exits" })

      
        return res.status(200).send({ status: true, message: "Success", data: cart })
    }
    catch (error) {
        res.status(500).send({ message: "Error", error: error.message })
    }
}



const deleteCart = async function (req, res) {
    try {

        const userId = req.params.userId

        if ((!ObjectId.isValid(userId))) {
            return res.status(400).send({ status: false, message: "Bad Request. userId invalid" })
        }

        const cart = await cartModel.findOneAndUpdate({ userId: userId },
            { items: [], totalItems: 0, totalPrice: 0 }, { new: true })
            

        if (!cart) return res.status(404).send({ status: false, msg: "Cart is not Exist" })

        return res.status(204).send({ status: true, msg: "cart is Successfully Deleted" })
    }

    catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}


module.exports = { createCart, updateCart, getCart, deleteCart }