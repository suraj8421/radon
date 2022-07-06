const bookModel = require("../models/bookModel")
const userModel = require("../models/userModel")

const ObjectId = require('mongoose').Types.ObjectId


const createBook = async function (req, res) {
    try {

        let body = req.body
        let userId= body.userId

        if (!ObjectId.isValid(userId)) { 
            return res.status(400).send({ status: false, message: "Bad Request. AuthorId invalid" })
        }

        let getUserData = await userModel.findById(userId)
        if(!getUserData) return res.status(404).send({status: false, message: "Data not found"})
        //console.log(getUserData)
        body.releasedAt = Date.now();

        let bookData = await bookModel.create(body)
        return res.status(201).send({ status: true, data: bookData })
    }
    catch (err) {
        return res.status(500).send({ message: "Serverside Errors. Please try again later", error: err.message })

    }
}


module.exports = { createBook }