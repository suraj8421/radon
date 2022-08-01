let cartModel = require("../models/cartModel")
const ObjectId = require('mongoose').Types.ObjectId



const createCart = async function (req, res) {
    try {
        let body = req.body
        let userId = req.params.userId
        let newItem = body.items
        let priceToAdd = body.totalPrice
        let itemsToAdd = body.totalItems

        /////////////////////////////////////////////// object id validation ///////////////////////////////////////////////



        let cartSearch = await cartModel.findOne({ userId : userId})
        if(cartSearch){
            
            let updateCart
       
                    
            updateCart = await cartModel.findOneAndUpdate({ userId: userId, "items.productId": newItem[0].productId }, { $inc: { "items.$.quantity": newItem[0].quantity, totalPrice: priceToAdd } }, { new: true })
     
            if(updateCart == null){
            updateCart = await cartModel.findOneAndUpdate({ userId: userId }, { $addToSet: { items: newItem }, $inc: { totalPrice: priceToAdd, totalItems: itemsToAdd } }, { new: true })
            }
            return res.send({ status: true, message: "Cart created successfully", data: updateCart })

        }else{
            body.userId = userId
            let cartData = await cartModel.create(body)
            return res.send({ status: true, message: "Cart created successfully", data: cartData })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Server side Errors. Please try again later", error: error.message })
    }
}


module.exports = {createCart}