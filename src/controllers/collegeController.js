const CollegeModel = require("../models/collegeModel")
const InternModel = require("../models/internModel")

const validator = require('validator')

// const isValid = function (value) {
//     if (typeof value === 'undefined' || value === null) return false
//     if (typeof value === 'string' && value.trim().length === 0) return false
//      return true
// }

// const isValidBody = function (body) {
//     return Object.keys(body).length > 0
// }

const createCollege = async function (req, res) {

    try {
        let data = req.body
        let name = data.name
        if (validator.isAlpha(name)===true) {


            // let {name, fullname, logoLink} = data
            // if (!isValid(name)) return res.status(400).send({status: false, msg: "College name should be present"})
            // if (typeof name === 'number') return res.status(400).send({status: false, msg: "College name should not be Number"})


            let collegeData = await CollegeModel.create(data)

            return res.status(201).send({ status: true, data: collegeData })
        } else { res.status(400).send({ status: false, msg: "College name should be present" }) }
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}


const getCollegeDetails = async function (req, res) {

    try {
        let data = req.query
        let collegeDetails = await CollegeModel.find(data)
        let allIntern = await InternModel.findById()

        return res.status(201).send({ status: true, data: collegeDetails })

    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}

module.exports.createCollege = createCollege
module.exports.getCollegeDetails = getCollegeDetails
