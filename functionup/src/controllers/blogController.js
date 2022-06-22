const AuthorModel = require("../models/AuthorModel")
const blogModel = require("../models/blogModel")


const createBlog = async function (req, res) {
    try {
        let data = req.body
        let create = await blogModel.create(data)
        res.status(201).send({ status: "true", data: create }).select({authorId:0})
    }
    catch (error) {
        console.log("This is the error :", error.message)
        res.status(500).send({ msg: "Error", error: error.message })
    }
}

const getBlog = async function (req, res) {
    let authorId= req.query.authorId
    let category=req.query.category
    let tages = req.query.tages
    try {let allBlogs = await blogModel.find({isPublished:"true" ,isDeleted:"false" ,$or:[{authorId:authorId}, {category:category}, {tages:tages}]})
    if (!allBlogs) return res.status(404).send({status:"false", msg :"No Document found",})
    res.status(201).send({ status: "true", data: allBlogs })
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
            // console.log(blogId)
            if (!blogId) return res.status(404).send({ status: false, msg: "No such User Exits" })
    
            if (!blogId.isDeleted == false) {
                res.status(404).send({ status: false, msg: "User is not Present / it's a deleted User" })
            }
            let updateData = await blogModel.findOneAndUpdate({ _id: blogId }, data, { new: true })
            let isPublished = await blogModel.updateOne({ _id: blogId }, { $set: { isPublished: true } }, { new: true })
            res.status(200).send({ status: true, msg: updateData })
        }
        catch (error) {
            // console.log("This is the Error", error.message) 
            res.status(500).send({ msg: "Error", error: error.message })
        }
    
    }


    module.exports.updateBlog = updateBlog
    module.exports.createBlog = createBlog
    module.exports.getBlog = getBlog