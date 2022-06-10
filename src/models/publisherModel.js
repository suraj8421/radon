
const mongoose= require ('mongoose');


const publisherSchema = new mongoose.Schema ({
    Name : String,
    headQuarter:String
}, 
 { timestamps: true });

 module.exports = mongoose.model('publisher', publisherSchema)
