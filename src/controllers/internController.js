const InternModel = require("../models/internModel")
const CollegeModel = require("../models/collegeModel")


// ---=+=---------=+=----------=+=----------- [ Create Intern ] ---=+=---------=+=----------=+=-----------//

const createIntern = async function (req, res) {
    try {

        let data = req.body

        let collegeData = await CollegeModel.findOne({ name: data.collegeName.trim() })
        
        data.collegeId = collegeData._id.toString()

        let internData = await InternModel.create(data)

        return res.status(201).send({ status: true, data: internData })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

// ---=+=---------=+=----------=+=----------- [ Exports ] ---=+=---------=+=----------=+=-----------//

module.exports.createIntern = createIntern 

// ---=+=---------=+=----------=+=----------- ****************** ---=+=---------=+=----------=+=-----------//