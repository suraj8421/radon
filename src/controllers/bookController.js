
const bookModel= require("../models/bookModel")
const newAuthor = require("../models/newAuthor")
const publisherModel = require("../models/publisherModel")

const createBook= async function (req, res) {
    let book = req.body
  
    let author_id=req.body.author
    let publisher_id=req.body.publisher

    if (!author_id) res.send({error: "author_id is required"})

    const authorInfo =await newAuthor.findById(author_id)
    if(!authorInfo) res.send({error:"enter valid author_id"})
    if (!publisher_id) res.send({error:"publisher_id is required"})

    const publisherInfo = await publisherModel.findById(publisher_id)
    if (!publisherInfo) res.send ({error:"enter valid publisher_id"})

    let bookCreated =await bookModel.create(Book)
    res.send({data:bookCreated})

}




const getBooksWithAuthorDetails = async function (req, res) {
    let specificBook = await bookModel.find().populate('author_id','publisher_id')
    res.send({data: specificBook})

}

module.exports.createBook= createBook

module.exports.getBooksWithAuthorDetails = getBooksWithAuthorDetails
