const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema( {
    bookName: String, 
    authorName: String, 
    tags: [String],
    
    isPublished: Boolean,
    prices: {
        indianPrice: String,
        europePrice: String,
    },
    sales: {type: Number, default: 10},
    
    summary :  mongoose.Schema.Types.Mixed,
    isDeleted: Boolean 

}, { timestamps: true });


module.exports = mongoose.model('Book', bookSchema) 
