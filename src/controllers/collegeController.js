const CollegeModel = require("../models/collegeModel")
const InternModel = require("../models/internModel")


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


// ---=+=---------=+=----------=+=----------- [ Create College] ---=+=---------=+=----------=+=-----------//

const createCollege = async function (req, res) {
    try {
        let data = req.body

        let { name, fullName, logoLink, isDeleted } = data

        if (!isValidBody(data)) return res.status(400).send({ status: false, message: "College Details required" })

        if (!name) return res.status(400).send({ status: false, message: "College name is not present" })

        if ( typeof (name) === 'number')  return res.status(400).send({ status: false, message: "Name should not be in Number" });
        
        var regEx = /^[a-z]+$/;
        if ( !regEx.test(name.trim()))  return res.status(400).send({ status: false, message: "Name is Invalid" });

        let Name = await CollegeModel.findOne({ name })

        if (Name) return res.status(400).send({ status: false, message: "College name is already registered" })

        if (!fullName) return res.status(400).send({ status: false, message: "College Fullname is not present" })

        if ( typeof (fullName) === 'number')  return res.status(400).send({ status: false, message: "Fullname should not be in Number" });

        if (!isValidField(fullName)) { return res.status(400).send({ status: false, message: "FullName is invalid" }); }
 
        let FullName = await CollegeModel.findOne({ fullName })

        if (FullName) return res.status(400).send({ status: false, message: "College Fullname is already registered" })

        if (!logoLink) return res.status(400).send({ status: false, message: "LogoLink is Missing" })

        if ( typeof (logoLink) === 'number')  return res.status(400).send({ status: false, message: "LogoLink should not be in Number" });

        if (!url_valid(logoLink)) return res.status(400).send({ status: false, message: "Invalid logo link" })

        if (isDeleted && (!(typeof (isDeleted) == "boolean"))) { return res.status(400).send({ status: false, message: "isDeleted Must be TRUE OR FALSE" }) }

        let collegeData = await CollegeModel.create(data)

        return res.status(201).send({ status: true, data: collegeData })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}


// ---=+=---------=+=----------=+=----------- [ Get College Detail] ---=+=---------=+=----------=+=-----------//

let getCollegeDetails = async function (req, res) {
    try {
        collegeName = req.query.collegeName

        if (!collegeName) return res.status(400).send({ status: false, message: "Missing college name in query param" });

        let collegeData = await CollegeModel.findOne({ name: collegeName, isDeleted: false })

        if (!collegeData) return res.status(404).send({ status: false, message: "College Not Found in DB" });

        collegedId = collegeData._id.toString()

        let internData = await InternModel.find({ collegeId: collegedId, isDeleted: false }).select("name email mobile")

        if (internData.length == 0) return res.status(200).send({ status: true, data: { "name": collegeData.name, "fullName": collegeData.fullName, "logoLink": collegeData.logoLink, "interns": "No intern Registered in this college" } });

        return res.status(200).send({ status: true, data: { "name": collegeData.name, "fullName": collegeData.fullName, "logoLink": collegeData.logoLink, "interns": internData } });
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

// ---=+=---------=+=----------=+=----------- [ Exports] ---=+=---------=+=----------=+=-----------//

module.exports.createCollege = createCollege
module.exports.getCollegeDetails = getCollegeDetails

// ---=+=---------=+=----------=+=----------- ****************** ---=+=---------=+=----------=+=-----------//
