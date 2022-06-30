const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId


// ---=+=---------=+=----------=+=----------- [ Intern Model] ---=+=---------=+=----------=+=-----------//

const internSchema = new mongoose.Schema({

    name: {
        type: String,
        lowercase: true,
        trim : true,
        required: true
    },
    email: {
        type: String,
        trim : true,
        required: true,
        unique: true
    },
    mobile: {
        type: String,
        required: true,
        trim : true,
        unique: true
    },
    collegeId: {
        type: ObjectId,
        required: true,
        ref: 'college'
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })


module.exports = mongoose.model('intern', internSchema)

// ---=+=---------=+=----------=+=----------- ****************** ---=+=---------=+=----------=+=-----------//
