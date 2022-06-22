const AuthorModel = require("../models/AuthorModel")
const jwt = require("jsonwebtoken")

const createAuthor = async function (req, res) {

  try {
    let data = req.body;
    let email = req.body.email
    let password = req.body.password
    let mailRegex = /^[a-zA-Z][a-zA-Z0-9\-\_\.]+@[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}$/;
    if (!email.match(mailRegex)) return res.status(401).send({ msg: "email is not valid" })
    //if (password.length >!= 8) return res.send({ msg: "Password is need to be 8 chracter" })
    let savedData = await AuthorModel.create(data);

    return res.status(201).send({ msg: savedData })
  }
  catch (err) {
    return res.status(500).send({ msg: false, data: err.message })
  }
};



module.exports.createAuthor = createAuthor