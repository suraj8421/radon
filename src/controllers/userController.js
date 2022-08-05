const userModel = require("../models/userModel")
const bcrypt = require('bcrypt');
const {uploadFile}= require('../aws/fileUpload')
const jwt = require("jsonwebtoken");
const ObjectId = require('mongoose').Types.ObjectId
const { isValid,isValidBody, nameRegex, emailRegex,validMobile,passwordRegex,pinRegex}=require('../middleware/valid')

////////////////////////////*Create user *//////////////////////////////////////////////////////////////////
const createUser = async function (req, res) {
    try {
        let body= req.body
        let {fname, lname, email, phone, password, address } = body

        if(!isValidBody(body)) return res.status(400).send({status: false, message: "Body cannot be blank"})
        //fname validation and fname regex
        if (!isValid(fname)) return res.status(400).send({ status: false, message: "First Name is required" })
        if (!nameRegex.test(fname)) return res.status(400).send({ status: false, message: "First Name should be albhabets" })
        //lname validation and lname regex
        if (!isValid(lname)) return res.status(400).send({ status: false, message: "Last Name is required" })
      if (!nameRegex.test(lname)) return res.status(400).send({ status: false, message: "Last Name should be albhabets" })
        //email valid and eamil regex
        if (!isValid(email)) return res.status(400).send({ status: false, message: "email is required" })
        if (!emailRegex.test(email)) return res.status(400).send({ status: false, message: "valid email is required" })
        //phone vallid and phone regex
        if (!isValid(phone)) return res.status(400).send({ status: false, message: "Phone Number required" })
        if (!validMobile.test(phone)) return res.status(400).send({ status: false, message: "Phone Number invalid. should be 10 digit" })


        //password vallid and password regex
        if(!isValid(password)) return res.status(400).send({ status: false, message: "Password is required" })
        if (!passwordRegex.test(password)) return res.status(400).send({status: false,message: "Please provide a valid password ,Password should be of 8 - 15 characters",})
      
        if (!isValidBody(address)) return res.status(400).send({ status: false, message: "Address cannot be blank" })


        if (address) {
            const parsedAddress = JSON.parse(body.address);
            address = parsedAddress;
            body.address = address

        }       

        if (!isValid(address.shipping)) {
            return res.status(400).send({ status: false, message: "Shipping address is required" })
        }

        if (!isValid(address.shipping.street)) {
            {
              return res.status(400).send({ status: false, message: "Please provide shipping street" });
            }
          }
          //city validation and city regex
          if (!isValid(address.shipping.city)) {
            {
              return res.status(400).send({ status: false, message: "Please provide shipping city" });
            }
          }
          if (!nameRegex.test(address.shipping.city)) return res.status(400).send({status: false,message: "city should be in alphabetical format" });
        //pincode validation and pincode regex
          if (!isValid(address.shipping.pincode)) {
            {
              return res.status(400).send({ status: false, message: "Please provide shipping pincode" });
            }
          }
        if (!pinRegex.test(address.shipping.pincode)) return res.status(400).send({status: false,message: "pincode should be in six numeric"})


          if (!isValid(address.billing)) {
            return res.status(400).send({ status: false, message: "Billing address is required" })
          }
          if (!isValid(address.billing.street)) {
            {
              return res.status(400).send({ status: false, message: "Please provide billing street" });
            }
          }
          //city validation and city regex
          if (!isValid(address.billing.city)) {
            {
              return res.status(400).send({ status: false, message: "Please provide billing city" });
            }
          }
          if (!nameRegex.test(address.billing.city)) return res.status(400).send({status: false,message: "city should be in alphabetical format" });

    //pincode validation and pincode regex
          if (!isValid(address.billing.pincode)) {
            {
              return res.status(400).send({ status: false, message: "Please provide billing pincode" });
            }
          }
        if (!pinRegex.test(address.billing.pincode)) return res.status(400).send({status: false,message: "pincode should be in six numeric"})


        let userDetails = await userModel.findOne({ $or: [{ phone: phone }, { email: email }] })

        if (userDetails) {
          if (userDetails.email == email) {
              return res.status(400).send({ status: false, message: `${email} email already exist` })
            } else {
              return res.status(400).send({ status: false, message: `${phone} phone already exist` })
            }
        }


        //encrypted passwordHash
        const hashPassword = bcrypt.hashSync(password, 10);
        body["password"] = hashPassword
        //file upload   
      let uploadedFileURL
        let files = req.files
        if (files && files.length > 0) {

            uploadedFileURL = await uploadFile(files[0])
        }
        else {
            res.status(400).send({ message: "profile image is required" })
        }
        body["profileImage"] = uploadedFileURL


        let usersData= await userModel.create(body)
        return res.status(201).send({status:true,message:"User created successfully",usersData})
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
        //check if userid is a valid objectid
        if ((!ObjectId.isValid(user))) {
            return res.status(400).send({ status: false, msg: "Bad Request. UserId invalid" })
        }
        let profile = await userModel.findOne({ _id: user })
        if (!profile) return res.status(404).send({ status: false, message: "User not found" })        
        return res.status(200).send({ status: true, message: "User profile details", data: profile })
    } catch (error) {
        return res.status(404).send({ status: false, message: "server side errors", error: error.message })
    }
}
////////////////////////////////////////*Update User * //////////////////////////////////////////////////////////////////////////////
const updateUserProfile = async function (req, res) {
  try {
    let body = req.body
    let user = req.params.userId
    
   // if (!isValidBody(body)) return res.status(400).send({ status: false, message: "Body is empty to update " })
     if (!isValidBody(body) && !req.files) return res.status(400).send({ status: false, message: "Body is empty to update " })


    let { fname, lname, email, phone, password } = body

    let files = req.files
    let profileImage;
    if (files && files.length > 0) {
      var uploadedFileURL = await uploadFile(files[0])
      profileImage = uploadedFileURL
    }

    
    if ("fname" in body) {
      if (!isValid(fname)) return res.status(400).send({ status: false, message: "Enter a valid fname" })
      if (!nameRegex.test(fname)) return res.status(400).send({ status: false, message: "Enter fname in alphabetical format" })
    }

    if ("lname" in body) {
      if (!isValid(lname)) return res.status(400).send({ status: false, message: "Enter a valid lname" })
      if (!nameRegex.test(lname)) return res.status(400).send({ status: false, message: "Enter lname in alphabetical format" })
    }


    let unique= []
    if ("email" in body) {
      if (!isValid(email)) return res.status(400).send({ status: false, message: "Enter a valid email id" })
      if (!emailRegex.test(email)) return res.status(400).send({ status: false, message: "Enter email in correct format" })
      unique.push({ email: email })
    }

    if ("phone" in body) {
      if (!isValid(phone)) return res.status(400).send({ status: false, message: "Enter a valid phone number" })
      if (!validMobile.test(phone)) return res.status(400).send({ status: false, message: "Enter Indian valid phone number   " })
      unique.push({ phone: phone })
    }

    if(unique.length>0){
    let userDetails = await userModel.findOne({ $or: unique })

    if (userDetails) {
      if (userDetails.email == email) {
        return res.status(400).send({ status: false, message: `${email} email  already exist` })
      } else {
        return res.status(400).send({ status: false, message: `${phone} phone already exist` })
      }
    }
  }

    if ("password" in body) {
      if (!isValid(body.password)) return res.status(400).send({ status: false, message: "Enter a valid password" })
      if (!passwordRegex.test(body.password)) return res.status(400).send({ status: false, message: "password should contain in 8 - 15 characters/special/numbers" })
      password = await bcrypt.hash(body.password, 10)
    }
    if ("address" in body) {
      const address = JSON.parse(body.address);
      body.address = address;

      const shipping = body.address.shipping;
      if (shipping) {
        if (shipping.pincode) {
          if (!pinRegex.test(shipping.pincode)) return res.status(400).send({ status: false, message: "pincode should contain six numeric" });
        }
      }
      const billing = body.address.billing
      if (billing) {
        if (billing.pincode) {
          if (!pinRegex.test(billing.pincode)) return res.status(400).send({ status: false, message: "pincode should contain six numeric " });
        }
      }
    }
    let result = { fname, lname, email, phone, password, profileImage }

    if (body.address) {
        result.address = {}
      const shipping = body.address.shipping;
      if (shipping) {
        result.address.shipping = {}
        if (shipping.street) {
          result.address.shipping.street = shipping.street;
        }
        
        
        if (shipping.city) {
          result.address.shipping.city = shipping.city;
        }
        
        if (shipping.pincode) {
          result.address.shipping.pincode = shipping.pincode;
        }
      }
      const billing = body.address.billing;
      if (billing) {
        result.address.billing = {}
        if (billing.street) {
          result.address.billing.street = billing.street;
        }
        if (billing.city) {
          result.address.billing.city = billing.city;
        }
        if (billing.pincode) {
          result.address.billing.pincode = billing.pincode;
        }
      }
    }
 

    let update = await userModel.findOneAndUpdate({ _id:user }, result, { new: true })

    return res.status(200).send({ status: true, message: " User profile Updated successfully", data: update })

  } catch (err) {
    console.log(err)
    return res.status(500).send({ status: false, message: "server side errors", error: err.message })
  }
}




module.exports = { createUser, userLogin, getProfile, updateUserProfile }