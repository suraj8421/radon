const mongoose = require('mongoose');
const CollegeModel = require("../models/collegeModel")
const InternModel = require("../models/internModel")

const validator = require('validator')

const isValidBody = function (body) {
    return Object.keys(body).length > 0
}

const isValidField = function (value) {
    let regEx = /^[a-zA-z]+([\s][a-zA-Z]+)*$/;
    return regEx.test(value)
}



const isValidObject = function (ObjectId) {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}


const collegeValidation = async function (req, res, next) {
    try {
        let data = req.body
        let { name, fullName, logoLink, isDeleted } = data
        if (!isValidBody(data)) return res.status(400).send({ status: false, message: "College Details required" })

        if (!name) return res.status(400).send({ status: false, message: "College name is not present" })

        var regEx = /^[a-z]+$/;
        if (!regEx.test(name)) {
            return res.status(400).send({ status: false, message: "Name is invalid" });
        }

        let Name = await CollegeModel.findOne({ name })

        if (Name) return res.status(400).send({ status: false, message: "College name is already used" })


        if (!fullName) return res.status(400).send({ status: false, message: "College Fullname is not present" })

        if (!isValidField(fullName)) { return res.status(400).send({ status: false, message: "FullName is invalid" }); }

        let FullName = await CollegeModel.findOne({ fullName })
        if (FullName) return res.status(400).send({ status: false, message: "College Fullname is already used" })


        if (!logoLink) return res.status(400).send({ status: false, message: "LogoLink is Missing" })

        if (isDeleted && (!(typeof (isDeleted) == "boolean"))) { return res.status(400).send({ status: false, message: "isDeleted Must be TRUE OR FALSE" }) }

        next()

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}


const internValidation = async function (req, res, next) {
    try {
        let data = req.body
        let { name, email, mobile, collegeId } = data
        if (!isValidBody(data)) return res.status(400).send({ status: false, message: "Intern Details are required" })

        if (!name) return res.status(400).send({ status: false, message: "Intern name is not present" })

        if (!isValidField(name)) { return res.status(400).send({ status: false, message: "Name is invalid" }); }

        let Name = await InternModel.findOne({ name })

        if (Name) return res.status(400).send({ status: false, message: "Intern name is already used" })

        if (!email) return res.status(400).send({ status: false, message: "Intern email is not present" })

        if (!validator.isEmail(email)) return res.status(400).send({ status: false, message: "Intern email is invalid" })

        let Email = await InternModel.findOne({ email })

        if (Email) return res.status(400).send({ status: false, message: "Intern email is already used" })

        if (!mobile) return res.status(400).send({ status: false, message: "Intern's mobile no is required." })

        const mobileRegex = /^[6-9]\d{9}$/

        if (!mobileRegex.test(mobile)) return res.status(400).send({ status: false, message: "Mobile no. should start from 6-9 and contain 10 digits " })

        let Mobile = await InternModel.findOne({ mobile })

        if (Mobile) return res.status(400).send({ status: false, message: "Intern Mobile no. is already used" })

        if (!collegeId) return res.status(400).send({ status: false, message: "College Id is not present" })

        if (!isValidObject(collegeId)) return res.status(400).send({ status: false, message: "Please provide Valid College Id" });

        let findCollegeID = await CollegeModel.findById(collegeId)
        if (!findCollegeID) return res.status(404).send({ status: false, message: "Entered College Id is Not Present in DB" })

        next()

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

module.exports.collegeValidation = collegeValidation
module.exports.internValidation = internValidation
