const AuthorModel = require("../models/AuthorModel")
const jwt = require("jsonwebtoken")

const createAuthor= async function (req, res) {
    
    try {
      let data = req.body;
    let savedData = await AuthorModel.create(data);
    return res.status(201).send({msg:savedData})
    }
     catch (err){
      return res.status(500).send(err.message)
    }
  };



    module.exports.createAuthor=createAuthor