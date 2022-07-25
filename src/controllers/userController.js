const userModel = require("../models/userModel")
const bcrypt = require('bcrypt');
const {uploadFile}= require('../aws/fileUpload')
const jwt = require("jsonwebtoken");
const { isValid,isValidBody, nameRegex, emailRegex,validMobile,passwordRegex,pinRegex}=require('../middleware/valid')

////////////////////////////*Create user *//////////////////////////////////////////////////////////////////
const createUser = async function (req, res) {
    try {
        let body= req.body
        let {fname, lname, email, phone, password, address } = body

        if(!isValidBody(body)) return res.status(400).send({status: false, message: "Body cannot be blank"})
        //fname validation and fname regex
        if (!isValid(fname)) return res.status(400).send({ status: false, message: "First Name is required" })
        if (!nameRegex.test(fname)) return res.status(400).send({ status: false, message: "First Name is required" })
        //lname validation and lname regex
        if (!isValid(lname)) return res.status(400).send({ status: false, message: "Last Name is required" })
        if (!nameRegex.test(lname)) return res.status(400).send({ status: false, message: "Last Name is required" })
        //email valid and eamil regex
        if (!isValid(email)) return res.status(400).send({ status: false, message: "email is required" })
        if (!emailRegex.test(email)) return res.status(400).send({ status: false, message: "email is required" })
        //phone vallid and phone regex
        if (!isValid(phone)) return res.status(400).send({ status: false, message: "Phone Number" })
        if (!validMobile.test(phone)) return res.status(400).send({ status: false, message: "Phone Number" })
        //password vallid and password regex
        if(!isValid(password)) return res.status(400).send({ status: false, message: "Password is required" })
        if (!passwordRegex.test(password)) return res.status(400).send({status: false,message: "Please provide a valid password ,Password should be of 8 - 15 characters",})
      
        if (address) {
            const parsedAddress = JSON.parse(body.address);
            address = parsedAddress;
            body.address = address
            if (!isValid(address.shipping)) {return res.status(400).send({ status: false, message: "Shipping address is required" })
            }
        }       
        if (!isValid(address.shipping.street)) {
            {
              return res.status(400).send({ status: false, message: "Please provide street" });
            }
          }
          //city validation and city regex
          if (!isValid(address.shipping.city)) {
            {
              return res.status(400).send({ status: false, message: "Please provide city" });
            }
          }
          if (!nameRegex.test(address.shipping.city)) return res.status(400).send({status: false,message: "city should be in alphabetical format" });
        //pincode validation and pincode regex
          if (!isValid(address.shipping.pincode)) {
            {
              return res.status(400).send({ status: false, message: "Please provide pincode" });
            }
          }
        if (!pinRegex.test(address.shipping.pincode)) return res.status(400).send({status: false,message: "pincode should be in six numeric"})


          if (!isValid(address.billing)) {
            return res.status(400).send({ status: false, message: "Billing address is required" })
          }
          if (!isValid(address.billing.street)) {
            {
              return res.status(400).send({ status: false, message: "Please provide street" });
            }
          }
          //city validation and city regex
          if (!isValid(address.billing.city)) {
            {
              return res.status(400).send({ status: false, message: "Please provide city" });
            }
          }
          if (!nameRegex.test(address.billing.city)) return res.status(400).send({status: false,message: "city should be in alphabetical format" });

    //pincode validation and pincode regex
          if (!isValid(address.billing.pincode)) {
            {
              return res.status(400).send({ status: false, message: "Please provide pincode" });
            }
          }
        if (!pinRegex.test(address.billing.pincode)) return res.status(400).send({status: false,message: "pincode should be in six numeric"})

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
        return res.status(500).send({ message: "Server side Errors. Please try again later", error: error.message })
    }
}
////////////////////////////*login user *//////////////////////////////////////////////////////////////////
const userLogin = async (req, res) => {
    try {
        let data = req.body
        const { email, password } = data

        if (!isValidBody(data))
            return res.status(400).send({ status: false, message: "please enter your email and password both" })

        if (!isValid(email)) return res.status(400).send({ status: false, message: "please enter your email address" })

        if (!data.email.trim().match(emailRegex))
            return res.status(400).send({ status: false, message: "Please enter valid email" })

        if (!isValid(password)) return res.status(400).send({ status: false, message: "please enter your password" })

        const isEmailExists = await userModel.findOne({ email: email })
        if (!isEmailExists) return res.status(401).send({ status: false, message: "Email is Incorrect" })

        if (!passwordRegex.test(password))
            return res.status(400).send({
                status: false,
                message: "Please provide a valid password ,Password should be of 8 - 15 characters",
            })

        // const isPasswordMatch = await bcrypt.compare(password, isEmailExists.password)
       

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

////////////////////////////*Get User Profile*//////////////////////////////////////////////////////////////////
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