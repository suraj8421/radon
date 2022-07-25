const userModel = require("../models/userModel")
const bcrypt = require('bcrypt');
const {uploadFile}= require('../aws/fileUpload')
const jwt = require("jsonwebtoken");
const { isValid,isValidBody, nameRegex, emailRegex,validMobile,passwordRegex,pinRegex}=require('../middleware/valid')

const createUser = async function (req, res) {
    try {

        let body= req.body

        let {fname, lname, email, phone, password} = body

        // console.log(body.address);
        console.log(body['address.billing.city']);

        if(!isValidBody(body)) return res.status(400).send({status: false, message: "Body cannot be blank"})

        if (!isValid(fname)) return res.status(400).send({ status: false, message: "First Name is required" })

        if (!isValid(lname)) return res.status(400).send({ status: false, message: "Last Name is required" })

        if (!isValid(email)) return res.status(400).send({ status: false, message: "email is required" })

        if (!isValid(phone)) return res.status(400).send({ status: false, message: "Phone Number" })

        // if (!isValidBody(body.address)) return res.status(400).send({ status: false, message: "Address cannot be blank" })

        // if (!isValidBody(body.address.shipping)) return res.status(400).send({ status: false, message: "Shipping Address cannot be blank" })

        // if (!isValidBody(body.address.billing)) return res.status(400).send({ status: false, message: "Billing Address cannot be blank" })

        if (!isValid(address.shipping.street)) return res.status(400).send({ status: false, message: "Shipping Street is required" })

        if (!isValid(address.shipping.city)) return res.status(400).send({ status: false, message: "Shipping city is required" })

        if (!isValid(address.shipping.pincode)) return res.status(400).send({ status: false, message: "Shipping pincode is required" })

        if (!isValid(address.billing.street)) return res.status(400).send({ status: false, message: "Billing Street is required" })

        if (!isValid(address.billing.city)) return res.status(400).send({ status: false, message: "Billing City is required" })

        if (!isValid(address.billing.pincode)) return res.status(400).send({ status: false, message: "Billing pincode is required" })


        if (!nameRegex.test(fname)) return res.status(400).send({ status: false, message: "first name reqire only letters only" })
        if (!nameRegex.test(lname)) return res.status(400).send({ status: false, message: "last name reqire only letters only" })
        if (!emailRegex.test(email)) return res.status(400).send({ status: false, message: "email is not valid" })
        if (!validMobile.test(phone)) return res.status(400).send({ status: false, message: " invalid Phone Number" })
        if (!passwordRegex.test(password)) return res.status(400).send({ status: false, message: " invalid password" })

        let userDetails = await userModel.findOne({ $or: [{ phone: phone }, { email: email }] })

        if (userDetails) {
            if (userDetails.phone == phone) {
                return res.status(400).send({ status: false, message: `${phone} phone number already exist` })
            } else {
                return res.status(400).send({ status: false, message: `${email} email already exist` })
            }
        }


        
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




const userLogin = async (req, res) => {
    try {
        let data = req.body
        const { email, password } = data

        if (!isValidBody(data))
            return res.status(400).send({ status: false, message: "please enter your email and password both" })

        if (!isValid(email)) return res.status(400).send({ status: false, message: "please enter your email address" })

        if (!isValid(password)) return res.status(400).send({ status: false, message: "please enter your password" })

        let user = await userModel.findOne({ email: email})

        if (!user) return res.status(400).send({status: false, message: "Email is not correct"});

        let passwordMatch = bcrypt.compareSync(password, user.password);

        if (passwordMatch === false) return res.status(401).send({status: false, message: "Password is not correct"});

        const token = jwt.sign(
            {
                userId: user._id.toString(),
            },
            "SECRET-OF-GROUP69", {
            expiresIn: "60min"
        }
        );
        res.setHeader("Authorization", token);
        return res.status(200).send({
            status: true, message: "User login successfull", data: {
                    userId: user._id,
                    token: token}} );
    }

         catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


const getProfile = async function (req, res) {
    try {

        let user = req.params.userId
        let profile = await userModel.findOne({ _id: user })
        if (!profile) {
            return res.status(404).send({ status: false, message: "User not found" })
        }
        res.status(200).send({ status: true, message: "User profile details", data: profile })
    } catch (error) {
        return res.status(404).send({ status: false, message: "server side errors", error: error.message })
    }
}




module.exports = { createUser, userLogin, getProfile }