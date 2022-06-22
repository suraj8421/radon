const AuthorModel = require("../models/authorModel")

const authorIdValidation = async function (req, res, next) {
    try {
        let authorId = req.body.authorId
        if (authorId.length != 24) return res.status(400).send({ status: false, msg: "invalid User Id" })
        else {
            let isAuthor = await AuthorModel.findById(authorId)
            if (!isAuthor) return res.status(400).send({ status: false, msg: "No such user exists" })
        }
        next()
    }
    catch (error) {
        console.log("This is the error :", error.message)
        res.status(500).send({ msg: "Error", error: error.message })
    }
}




module.exports.authorIdValidation = authorIdValidation