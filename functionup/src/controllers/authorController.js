const AuthorModel = require("../models/AuthorModel")



const createAuthor = async function (req, res) {
  try {
    let data = req.body;
    let savedData = await AuthorModel.create(data);
    return res.status(201).send({ msg: savedData })
  }
  catch (error) {
    console.log("This is the error :", error.message)
    res.status(500).send({ msg: "Error", error: error.message })
  }
};


module.exports.createAuthor = createAuthor