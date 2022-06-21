const blogModel = require("../models/blogModel")


const createBlog = async function (req, res) {
    try {
        let data = req.body
        let create = await blogModel.create(data)
        res.status(201).send({ msg: "done", data: create })
    }
    catch (error) {
        console.log("This is the error :", error.message)
        res.status(500).send({ msg: "Error", error: error.message })
    }
}

const updateBlog = async function (req, res) {
    blogId = req.params.blogId
    let blogData = req.body;
    console.log(blogData)
    let updatedUser = await blogModel.findOneAndUpdate({ _id: blogId }, blogData, { new: true });
    res.send({ status: "updated", data: updatedUser });
}


module.exports.updateBlog = updateBlog
module.exports.createBlog = createBlog