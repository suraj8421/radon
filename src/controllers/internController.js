const InternModel = require("../models/internModel")
const CollegeModel = require("../models/collegeModel")
const validator = require('validator')


// ---=+=---------=+=----------=+=----------- [ Validation Functions ] ---=+=---------=+=----------=+=-----------//

const isValidBody = function (body) {
    return Object.keys(body).length > 0
}

const isValidField = function (value) {
    let regEx = /^[a-zA-z.,@_&]+([\s][a-zA-Z.,@_&]+)*$/
    return regEx.test(value.trim())
}


// ---=+=---------=+=----------=+=----------- [ Create Intern ] ---=+=---------=+=----------=+=-----------//

const createIntern = async function (req, res) {
    try {

        let data = req.body

        let { name, email, mobile, collegeName } = data

        if (!isValidBody(data)) return res.status(400).send({ status: false, message: "Intern Details are required" })

        if (!name) return res.status(400).send({ status: false, message: "Please provide Intern name" })
    
        if ( typeof (name) === 'number')  return res.status(400).send({ status: false, message: "Name should not be in Number" });

        if (!isValidField(name)) { return res.status(400).send({ status: false, message: "Name is invalid" }); }

        if (!email) return res.status(400).send({ status: false, message: "Please provide Intern Email" })

        if ( typeof (email) === 'number')  return res.status(400).send({ status: false, message: "Email should not be in Number" });

        if (!validator.isEmail(email.trim())) return res.status(400).send({ status: false, message: "Intern Email is invalid" })

        let Email = await InternModel.findOne({ email })

        if (Email) return res.status(400).send({ status: false, message: "Intern Email is already registered" })

        if (!mobile) return res.status(400).send({ status: false, message: "Intern Mobile no. is required" })

        const mobileRegex = /^[6-9]\d{9}$/

        if (!mobileRegex.test(mobile.trim())) return res.status(400).send({ status: false, message: "Mobile no. should start from 6-9 and contain 10 digits" })

        let Mobile = await InternModel.findOne({ mobile })

        if (Mobile) return res.status(400).send({ status: false, message: "Intern Mobile no. is already registered" })

        if (!collegeName) return res.status(400).send({ status: false, message: "Please provide College Name" })

        if ( typeof (collegeName) === 'number')  return res.status(400).send({ status: false, message: "CollegeName should not be in Number" });

        let findCollegeName = await CollegeModel.findOne({ name: data.collegeName.trim() })

        if (!findCollegeName) return res.status(404).send({ status: false, message: "Entered College Name is Not Present in DB" })

        let collegeData = await CollegeModel.findOne({ name: collegeName.trim() })
        
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