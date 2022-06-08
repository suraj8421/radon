const UserModel= require("../models/userModel")

const createBook= async function (req, res) {
    let data= req.body
    let savedData= await UserModel.create(data)
    res.send({msg: savedData})
}

const getBooksData= async function (req, res) {
    let allBooks= await UserModel.find()
    res.send({msg: allBooks})
}
const yearDetails = async function (req, res) {
    let yearList= await UserModel.find({ year: req.body.year }).select({bookName:1,_id: 0})
    res.send(yearList)
 }
 const particularBooks = async function (req, res) {
    
    let specificBooks = await UserModel.find(req.body)

    res.send({msg:specificBooks})
 }
 const priceDetails= async function(req,res){
    let list = await UserModel.find({"prices.indianPrice": {$in: ["100INR", "200INR","500 INR"]}})}

    const randomBooks= async function(req, res) {
        let allBooks = await UserModel.find({$or:[ {stockAvailable: true},{ totalPages: {$gt: 500}}]})}
    


module.exports.createBook= createBook
module.exports.getBooksData= getBooksData
module.exports.yearDetails= yearDetails
module.exports.particularBooks= particularBooks
module.exports.priceDetails=priceDetails
module.exports.randomBooks=randomBooks