const CollegeModel = require("../models/collegeModel")
const InternModel = require("../models/internModel")


const createCollege = async function (req, res) {
    try {
        let data = req.body

        let collegeData = await CollegeModel.create(data)

        return res.status(201).send({ status: true, data: collegeData })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}


const getCollegeDetails = async function (req, res) {

    try {
        let data = req.query

        if ((Object.keys(data).length === 0)) return res.status(400).send({ status: false, message: "College Details required in query" })

        let collegeDetails = await CollegeModel.findOne(data).select({ name: 1, fullName: 1, logoLink: 1 })

        let interns = await InternModel.find({ collegeId: collegeDetails._id.toString() }).select({ name: 1, email: 1, mobile: 1 })

        let name = collegeDetails.name
        let fullName = collegeDetails.fullName
        let logoLink = collegeDetails.logoLink

        let collegeData = {
            name: name,
            fullName: fullName,
            logoLink: logoLink,
            interns: interns
        }

        return res.status(201).send({ status: true, data: collegeData })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

module.exports.createCollege = createCollege
module.exports.getCollegeDetails = getCollegeDetails
