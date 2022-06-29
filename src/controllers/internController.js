const InternModel = require("../models/internModel")


const createIntern = async function (req, res) {
    try {
        let data = req.body
        
        let internData = await (await InternModel.create(data))

        return res.status(201).send({ status: true, data: internData })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

module.exports.createIntern = createIntern