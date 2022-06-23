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


// *********************** Post-Login *********************** //

const loginAuthor = async function (req, res) {
  let email = req.body.emailId;
  let password = req.body.password;

  let user = await AuthorModel.findOne({ emailId: email, password: password });
  if (!user)return res.status(404).send({status: false, msg: "Email-Id or the password is not exist"});

  let token = jwt.sign(
    {
      userId: user._id.toString(),
      batch: "Radon",
      organisation: "FunctionUp",
    },
    "functionup-project-1"
  );
  res.setHeader("x-auth-token", token);
  res.status(201).send({ status: true, token: token });
};






module.exports.createAuthor = createAuthor
module.exports.loginAuthor = loginAuthor