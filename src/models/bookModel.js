const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId
const publisherId =mongoose.Schema.Types.ObjectId
const bookSchema = new mongoose.Schema( {
    name: String,
    author_id: {
        type: ObjectId,
        ref: "newAuthor"
    },
    price: Number,
    ratings: Number,
   publisher_id:{
    type: ObjectId,
    ref: "publisherModel"
   }

}, { timestamps: true });


module.exports = mongoose.model('LibraryBook', bookSchema)
