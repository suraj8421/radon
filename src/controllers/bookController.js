const bookModel = require("../models/bookModel")
const userModel = require("../models/userModel")
const ObjectId = require('mongoose').Types.ObjectId


const createBook = async function(req, res) {
    try {

        let body = req.body

        if (!ObjectId.isValid(body.userId)) {
            return res.status(400).send({ status: false, msg: "Bad Request. AuthorId invalid" })
        }


        let bookData = await bookModel.create(body)
        return res.status(201).send({ status: true, data: bookData })
    } catch (err) {
        return res.status(500).send({ msg: "Server side Errors. Please try again later", error: err.message })

    }
}
const bookDetails = async function(req, res) {
    try {
        let query = req.query;
        let filter = {
            isDeleted: false,
            ...query
        };
        if (query.userId) {
            const validate = await userModel.findById(query.userId);
            if (!validate) return res.status(404).send({ status: false, msg: "UserId is not valid" });
        }
        const data = await bookModel.find(filter).select({ ISBN: 0, subcategory: 0, __v: 0 }).sort({ title: 1 })
        if (!data) return res.status(404).send({ status: false, msg: "No blog is found" })
        res.status(200).send({
            status: true,
            message: "Book List",
            data: data
        })
    } catch (err) {
        res.status(500).send({ status: false, Error: err.message })
    }
}


module.exports = { createBook, bookDetails }