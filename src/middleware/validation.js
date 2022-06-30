const CollegeModel = require("../models/collegeModel")
const InternModel = require("../models/internModel")
const validator = require('validator')

// ---=+=---------=+=----------=+=----------- [ Validation Functions ] ---=+=---------=+=----------=+=-----------//

const isValidBody = function (body) {
    return Object.keys(body).length > 0
}

const isValidField = function (value) {
    let regEx = /^[a-zA-z.,@_&]+([\s][a-zA-Z.,@_&]+)*$/
    return regEx.test(value.trim())
}

const url_valid = function (url) {
    let regex = /^https?:\/\/.*\/.*\.(png|gif|webp|jpeg|jpg)\??.*$/gmi
    return regex.test(url.trim())
}


// ---=+=---------=+=----------=+=----------- [ College Validation ] ---=+=---------=+=----------=+=-----------//

const collegeValidation = async function (req, res, next) {
    try {
        let data = req.body
        let { name, fullName, logoLink, isDeleted } = data
        if (!isValidBody(data)) return res.status(400).send({ status: false, message: "College Details required" })

        if (!name) return res.status(400).send({ status: false, message: "College name is not present" })

        var regEx = /^[a-z]+$/;
        if (!regEx.test(name.trim()))  return res.status(400).send({ status: false, message: "Name is Invalid" });

        let Name = await CollegeModel.findOne({ name })

        if (Name) return res.status(400).send({ status: false, message: "College name is already registered" })

        if (!fullName) return res.status(400).send({ status: false, message: "College Fullname is not present" })

        if (!isValidField(fullName)) { return res.status(400).send({ status: false, message: "FullName is invalid" }); }

        let FullName = await CollegeModel.findOne({ fullName })

        if (FullName) return res.status(400).send({ status: false, message: "College Fullname is already registered" })

        if (!logoLink) return res.status(400).send({ status: false, message: "LogoLink is Missing" })

        if (!url_valid(logoLink)) return res.status(400).send({ status: false, message: "Invalid logo link" })

        if (isDeleted && (!(typeof (isDeleted) == "boolean"))) { return res.status(400).send({ status: false, message: "isDeleted Must be TRUE OR FALSE" }) }

        next()

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}


// ---=+=---------=+=----------=+=----------- [ Intern Validation ] ---=+=---------=+=----------=+=-----------//

const internValidation = async function (req, res, next) {
    try {
        let data = req.body
        let { name, email, mobile, collegeName } = data

        if (!isValidBody(data)) return res.status(400).send({ status: false, message: "Intern Details are required" })

        if (!name) return res.status(400).send({ status: false, message: "Please provide Intern name" })

        if (!isValidField(name)) { return res.status(400).send({ status: false, message: "Name is invalid" }); }

        let Name = await InternModel.findOne({ name })

        if (Name) return res.status(400).send({ status: false, message: "Intern name is already registered" })

        if (!email) return res.status(400).send({ status: false, message: "Please provide Intern Email" })

        if (!validator.isEmail(email.trim())) return res.status(400).send({ status: false, message: "Intern Email is invalid" })

        let Email = await InternModel.findOne({ email })

        if (Email) return res.status(400).send({ status: false, message: "Intern Email is already registered" })

        if (!mobile) return res.status(400).send({ status: false, message: "Intern Mobile no. is required" })

        const mobileRegex = /^[6-9]\d{9}$/

        if (!mobileRegex.test(mobile.trim())) return res.status(400).send({ status: false, message: "Mobile no. should start from 6-9 and contain 10 digits" })

        let Mobile = await InternModel.findOne({ mobile })

        if (Mobile) return res.status(400).send({ status: false, message: "Intern Mobile no. is already registered" })

        if (!collegeName) return res.status(400).send({ status: false, message: "Please provide College Name" })

        let findCollegeName = await CollegeModel.findOne({ name: data.collegeName.trim() })

        if (!findCollegeName) return res.status(404).send({ status: false, message: "Entered College Name is Not Present in DB" })

        next()

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

// ---=+=---------=+=----------=+=----------- [ Exports ] ---=+=---------=+=----------=+=-----------//

module.exports.collegeValidation = collegeValidation
module.exports.internValidation = internValidation

// ---=+=---------=+=----------=+=----------- ****************** ---=+=---------=+=----------=+=-----------//