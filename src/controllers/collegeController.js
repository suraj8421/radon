const CollegeModel = require("../models/collegeModel")
const InternModel = require("../models/internModel")


// ---=+=---------=+=----------=+=----------- [ Create College] ---=+=---------=+=----------=+=-----------//

const createCollege = async function (req, res) {
    try {
        let data = req.body

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
