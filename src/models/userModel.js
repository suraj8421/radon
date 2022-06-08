const mongoose = require('mongoose');



const bookSchema = new mongoose.Schema({
    bookName: {
        type: String,
        unique: true,
        required: true
    },
    authorName: { type: String, required: true },
    tag: [String],
    year:{ 
        type:Number,
        default:2020},
    pagenumber :Number,
    price: {
        indian: String,
        european: String
    }
}, { timestamps: true });

 module.exports = mongoose.model('Usr', bookSchema)

