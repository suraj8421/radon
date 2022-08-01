let cartModel = require("../models/cartModel")
const ObjectId = require('mongoose').Types.ObjectId
const { isValid, isValidBody, positiveIntigerRegex, priceRegex } = require('../middleware/valid')
const productModel = require('../models/productModel')





const createCart = async function (req, res) {
    try {
        let body = req.body
        let userId = req.params.userId
        let newItem = body.items
        let priceToAdd = body.totalPrice
        let productId = newItem[0].productId
        let productQuantity = newItem[0].quantity

        ////////////////////////////////////////////// body validation //////////////////////////////////////////////////
        if (!isValidBody(body)) return res.status(400).send({ status: false, message: "Body cannot be empty" })

        /////////////////////////////////////////////// object id validation ///////////////////////////////////////////////
        if (!ObjectId.isValid(userId)) return res.status(400).send({ status: false, message: "Bad Request. userId invalid" })
        if (!ObjectId.isValid(productId)) return res.status(400).send({ status: false, message: "Bad Request. productId invalid" })

        /////////////////////////////////////////////////items validation /////////////////////////////////////////////////////////
        if (newItem.length === 0) return res.status(400).send({ status: false, message: "new Item array cannot be empty" })
        if (!Array.isArray(newItem)) return res.status(400).send({ status: false, message: "item must be in array" })
        if (!isValid(productQuantity)) return res.status(400).send({ status: false, message: "product Quantity should be given" })

        if (!positiveIntigerRegex.test(productQuantity)) return res.status(400).send({ status: false, message: "Enter a valid quantity" })


        /////////////////////////////////////////////// validating product existance//////////////////////////////////////////////
        let productSearch = await productModel.findOne({ _id: productId, isDeleted: false })
        if (!productSearch) return res.status(400).send({ status: false, message: "product with this id is not available. please enter a valid product id" })

        let productPrice = productSearch.price



        let cartSearch = await cartModel.findOne({ userId : userId})
        if(cartSearch){
          
            priceToAdd = productSearch.price * productQuantity
                        
            let updateCart = await cartModel.findOneAndUpdate({ userId: userId, "items.productId": productId }, { $inc: { "items.$.quantity": productQuantity, totalPrice: priceToAdd } }, { new: true })
     
            if(updateCart == null){
            updateCart = await cartModel.findOneAndUpdate({ userId: userId }, { $addToSet: { items: newItem }, $inc: { totalPrice: priceToAdd, totalItems: 1 } }, { new: true })
            }
            return res.send({ status: true, message: "Cart created successfully", data: updateCart })

        }else{
            let newProductData = { userId, newItem}
            newProductData.totalPrice = productPrice
            newProductData.totalItems = 1
            let cartData = await cartModel.create(body)
            return res.send({ status: true, message: "Cart created successfully", data: cartData })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Server side Errors. Please try again later", error: error.message })
    }
}




const updateCart = async function (req, res) {
    try {
        let body = req.body;
        const { cartId, productId, removeProduct } = body
        if (!isValidBody(body)) return res.status(400).send({ status: false, message: "Body should not be empty" })

        if (!ObjectId.isValid(cartId)) return res.status(400).send({ status: false, message: "card Id is invalid" })
        const findCart = await cartModel.findOne({ _id: cartId })
        if (!findCart) return res.status(400).send({ status: false, message: "Cart id not exist" })

        if (!ObjectId.isValid(productId)) return res.status(400).send({ status: false, message: "product Id is invalid" })
        const findProduct = await productModel.findOne({ _id: productId, isDeleted: false })
        if (!findProduct) return res.status(400).send({ status: false, message: "product does not not exist" })

        if (!isValid(removeProduct)) return res.status(400).send({ status: false, message: "please enter your removeProduct" })

        // if (!/^[0|9]$/.test(removeProduct)) return res.status(400).send({ status: false, message: "remove product is to be removed as 0 or reduce one " })

        for (let i = 0; i < findCart.items.length; i++) {
            if (findProduct._id.toString() == findCart.items[i].productId.toString()) {
                if (removeProduct == 1 && findCart.items[i].quantity > 1) {
                    // let itemQuantity = (findCart.items[i].quantity - 1)
                    let updateCart = await cartModel.findOneAndUpdate({ _id: cartId, "items.productId": productId }, { $inc: { "items.$.quantity": -1, totalPrice: -(findProduct.price) } }, { new: true }).lean()
                    return res.status(200).send({ status: true, message: "cart updated successfully", data: updateCart })
                } else {
                    let updateCart = await cartModel.findOneAndUpdate({ _id: cartId }, { $pull: { items: { productId: productId } }, $inc: { totalItems: -1, totalPrice: -(findProduct.price * (findCart.items[i].quantity)) } }, { new: true })
                    return res.status(200).send({ status: true, message: "removed successfully", data: updateCart })
                }
            }
        }


        // let itemQuantity
        // for (let i = 0; i < findCart.items.length; i++){
        //     if (findCart.items[i].productId == productId){
        //         itemQuantity = findCart.items[i].quantity
        //     }
        // }

        // let updateProduct
        // let priceToDecrease = findProduct.price
        // if (removeProduct == 1 && itemQuantity>1){
        //     updateProduct = await cartModel.findOneAndUpdate({ _id: cartId, "items.productId": productId }, { $inc: { "items.$.quantity": -1, totalPrice: -priceToDecrease } }, { new: true })
        //     return res.status(400).send({ status: true, message: "cart updated successfully", data: updateProduct })
        // }else{
        //     priceToDecrease = priceToDecrease * itemQuantity
        //     updateProduct = await cartModel.findOneAndUpdate({ _id: cartId }, { $pull: { items: { productId: productId } }, $inc: { totalItems: -1, totalPrice: -priceToDecrease } }, { new: true })
        //     return res.status(400).send({ status: true, message: "removed successfully", data: updateProduct })
        // }

    } catch (err) {
        console.log(err);
        return res.status(500).send({ status: false, message: "There is an error inside of the code" })
    }
}



const getCart = async function (req, res) {
    try {

        let userId = req.params.userId
        if ((!ObjectId.isValid(userId))) {
            return res.status(400).send({ status: false, message: "Bad Request. userId  is invalid" })
        }

        let cart = await cartModel.findOne({ userId: userId }).select({ __v: 0 })
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
        // if (req.userId !== userId) return res.status(403).send({ status: false, message: "Unauthorized access" })

        const cart = await cartModel.findOneAndUpdate({ userId: userId },
            { items: [], totalItems: 0, totalPrice: 0 }, { new: true })
            

        if (!cart) return res.status(404).send({ status: false, msg: "Cart is not Exist" })

        // console.log(cart);
        return res.status(200).send({ status: true, msg: "cart is Successfully Deleted", data: cart })
    }

    catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}


module.exports = { createCart, updateCart, getCart, deleteCart }