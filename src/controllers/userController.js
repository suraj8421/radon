const userModel = require("../models/userModel")
const jwt = require("jsonwebtoken")



const createUser = async function (req, res) {

    try {
        let data = req.body  
        let savedData = await userModel.create(data)
        res.status(201).send({ status: true, message: 'Success', data: savedData })
    }

    catch (err) {
        res.status(500).send({ status: false, message: err.message })

    }
}




const loginUser = async function (req, res) {

    try {
    let user = await userModel.findOne(req.body);
    if (!user)
        return res.status(400).send({
            status: false,
            message: "Bad Request. username or the password is not corerct",
        });
    let token = jwt.sign(
        {
            userId: user._id.toString()
        },
        "ASDFGH3456OKJNBDCFGHJ",
        { expiresIn: "10min" }

    );
    res.setHeader("x-api-key", token);
    res.status(200).send({ status: true, message: "Login Successfull", taken: token });
}

    catch (err) {
    res.status(500).send({ status: false, message: err.message })

}
}

module.exports = { createUser, loginUser}