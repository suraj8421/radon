const AuthorModel = require("../models/AuthorModel")
const blogModel = require("../models/blogModel")


const createBlog = async function (req, res) {
    try {
        let data = req.body
        let create = await blogModel.create(data)
        res.status(201).send({ status: "true", data: create })
    }
    catch (error) {
        console.log("This is the error :", error.message)
        res.status(500).send({ msg: "Error", error: error.message })
    }
}

const getBlog = async function (req, res) {
    let authorId = req.query.authorId
    let category = req.query.category
    let tages = req.query.tages
    try {

        let allBlogs = await blogModel.find({ isPublished: "true", isDeleted: "false", $in: [{ authorId: authorId }, { category: category }, { tages: tages }] })
        if (!allBlogs) return res.status(404).send({ status: "false", msg: "No Document found", })
        res.status(200).send({ status: "true", data: allBlogs })

    }
    catch (error) {
        console.log("This is the error :", error.message)
        res.status(500).send({ msg: "Error", error: error.message })
    }
}


const updateBlog = async function (req, res) {
    try {
        let data = req.body
        let blogId = await blogModel.findById(req.params.blogId)
        if (!blogId) return res.status(404).send({ status: false, msg: "No such User Exits" })

        if (!blogId.isDeleted == false) {
            res.status(404).send({ status: false, msg: "User is not Present / it's a deleted User" })
        }

        let updateData = await blogModel.findOneAndUpdate({ _id: blogId }, data, { new: true })
        let isPublished = await blogModel.updateOne({ _id: blogId }, { $set: { isPublished: true } }, { new: true })
        res.status(200).send({ status: true, msg: updateData })
    }
    catch (error) {
        console.log("This is the Error", error.message)
        res.status(500).send({ msg: "Error", error: error.message })
    }

}

const deleteBlog = async function (req, res) {
    try {
        const blogId = req.params.blogId
        const blog = await blogModel.findByIdAndUpdate(blogId, { $set: { isDeleted: true, deletedAt: new Date() } })

        if (!blog) return res.status(404).send({ status: false, msg: "Blog Id is not Exist" })
        console.log("Successfully Deleted")
        return res.status(200).send("")
    }

    catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }

}


const deleteBlogByParams = async function (req, res) {
    try {
        const authorId = req.query.authorId
        const category = req.query.category
        const tages = req.query.tages
        const subcategory = req.query.subcategory
        const unpublished = req.query.isPublished

        const findForDelete = await blogModel.findOneAndUpdate({ authorId: authorId, category: category, tages: tages, subcategory: subcategory, isPublished: unpublished }, { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true })
        res.status(201).send({ Msg: findForDelete })
    }
    catch (error) {
        console.log("This is the Error", error.message)
        res.status(500).send({ msg: "Error", error: error.message })
    }

}




module.exports.updateBlog = updateBlog
module.exports.createBlog = createBlog
module.exports.getBlog = getBlog
module.exports.deleteBlogByParams = deleteBlogByParams
module.exports.deleteBlog = deleteBlog