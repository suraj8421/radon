const userModel = require("../models/userModel")
const aws = require("aws-sdk")
const bcrypt = require('bcrypt');


aws.config.update({
    accessKeyId: "AKIAY3L35MCRVFM24Q7U",
    secretAccessKey: "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",
    region: "ap-south-1"
})

let uploadFile = async (file) => {
    return new Promise(function (resolve, reject) {
        // this function will upload file to aws and return the link
        let s3 = new aws.S3({ apiVersion: '2006-03-01' }); // we will be using the s3 service of aws

        var uploadParams = {
            ACL: "public-read",
            Bucket: "classroom-training-bucket",  //HERE
            Key: "group69-project5/" + file.originalname, //HERE 
            Body: file.buffer
        }


        s3.upload(uploadParams, function (err, data) {
            if (err) {
                return reject({ "error": err })
            }
            // console.log(data)
            // console.log("file uploaded succesfully")
            return resolve(data.Location)
        })
    })
}





const createUser = async function (req, res) {
    try {

        let files = req.files
        if (files && files.length > 0) {

            var uploadedFileURL = await uploadFile(files[0])
        }
        else {
            res.status(400).send({ msg: "No file found" })
        }

        let body= req.body

        let {fname, lname, email, phone, password, address } = body

        
        const encryptedPassword = async function(enteredPassword){
            const passwordHash = await bcrypt.hash(enteredPassword, 15)
            body.password = passwordHash
        }
        encryptedPassword(password)

        body["profileImage"] = uploadedFileURL
        let usersData= await userModel.create(body)
        return res.send(usersData)





    } catch (error) {

        console.log(error);
        return res.status(500).send({ message: "Server side Errors. Please try again later", error: error.message })

    }
}



module.exports = { createUser }