const bookModel = require("../models/bookModel")
const ObjectId = require('mongoose').Types.ObjectId


const createBook = async function (req, res) {
    try {

        let body = req.body

        if (!ObjectId.isValid(body.userId)) { 
            return res.status(400).send({ status: false, msg: "Bad Request. AuthorId invalid" })
        }


        let bookData = await bookModel.create(body)
        return res.status(201).send({ status: true, data: bookData })
    }
    catch (err) {
        return res.status(500).send({ msg: "Serverside Errors. Please try again later", error: err.message })

    }
}


module.exports = { createBook }