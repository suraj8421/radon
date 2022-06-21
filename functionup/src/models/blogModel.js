
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    authorId: {
        required: true,
        type: ObjectId,
        ref: "Author"
    },
    tages: [String],
    category: {
        type: [String],
        required: true,
    },
    subcategory: {
        type: [String],

    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    // deletedAt: {
    //     //type: Boolean,
    //     //default: false,
    //     //timestamps: true
    //     type: Date.now()
    // },
    // publishedAt: {
    //     type: Boolean,
    //     default: false,
    //     timestamps: true
    // },


}, { timestamps: true })

module.exports = mongoose.model('Blog', blogSchema)