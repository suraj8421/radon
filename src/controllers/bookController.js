const bookModel = require("../models/bookModel")
const userModel = require("../models/userModel")
const ObjectId = require('mongoose').Types.ObjectId



const isValid = function(x) {
    if (typeof x === "undefined" || x === null) return false;
    if (typeof x === "string" && x.trim().length === 0) return false;
    return true;
};
const isValidBody = function(x) {
    return Object.keys(x).length > 0;
};


const createBook = async function(req, res) {
    try {

        let body = req.body

        if (!isValidBody(body)) {
            return res.status(400).send({ status: false, msg: "Invalid Request Parameter, Please Provide Another Details", });
        }

        const { title, excerpt, category, subcategory, ISBN, userId } = body


        if (!isValid(title)) {
            return res.status(400).send({ status: false, msg: "Title is Required" })
        }
        if (!isValid(excerpt)) {
            return res.status(400).send({ status: false, msg: "Excerpt is Required" })
        }
        if (!isValid(category)) {
            return res.status(400).send({ status: false, msg: "category is Required" })
        }
        if (!isValid(subcategory)) {
            return res.status(400).send({ status: false, msg: "subcategory is Required" })
        }




        if (!ObjectId.isValid(userId)) {
            return res.status(400).send({ status: false, msg: "Bad Request. UserId invalid" })
        }

        let getUserData = await userModel.findById(userId)
        if (!getUserData) return res.status(404).send({ status: false, message: "Data not found" })

        let bookData = await bookModel.create(body)
        return res.status(201).send({ status: true, data: bookData })
    } catch (err) {
        console.log(err)
        return res.status(500).send({ msg: "Server side Errors. Please try again later", error: err.message })

    }
}
const bookDetails = async function(req, res) {
    try {
        let query = req.query;
        let { userId, category, subcategory, tags } = query;
        let filter = {
            isDeleted: false
        };

        if (subcategory) filter.subcategory = { $all: subcategory.split(",") }
        if (category) filter.category = category;
        if (userId) filter.userId = userId;

        if (query.userId) {
            const validate = await userModel.findById(query.userId);
            if (!validate) return res.status(404).send({ status: false, msg: "UserId is not valid" });
        }

        const data = await bookModel.find(filter).select({ ISBN: 0, subcategory: 0, __v: 0 }).sort({ title: 1 })
        if (!data) return res.status(404).send({ status: false, msg: "No book is found" })
        return res.status(200).send({
            status: true,
            message: "Book List",
            data: data
        })
    } catch (err) {
        return res.status(500).send({ status: false, Error: err.message })
    }
}


module.exports = { createBook, bookDetails }