const userModel = require("../models/userModel")
const bcrypt = require('bcrypt');
const {uploadFile}= require('../aws/fileUpload')
const { isValid,isValidBody, nameRegex, emailRegex,validMobile,passwordRegex,pinRegex}=require('../middleware/valid')

const createUser = async function (req, res) {
    try {

        let body= req.body

        let {fname, lname, email, phone, password, address } = body

        
        //encrypted passwordHash
        const hashPassword = bcrypt.hashSync(password, 10);
        body["password"] = hashPassword
        //file upload   
        let files = req.files
        if (files && files.length > 0) {

            var uploadedFileURL = await uploadFile(files[0])
        }
        else {
            res.status(400).send({ msg: "No file found" })
        }
        body["profileImage"] = uploadedFileURL


        let usersData= await userModel.create(body)
        return res.send({status:true,message:"User created successfully",usersData})





    } catch (error) {

        console.log(error);
        return res.status(500).send({ message: "Server side Errors. Please try again later", error: error.message })

    }
}



module.exports = { createUser }