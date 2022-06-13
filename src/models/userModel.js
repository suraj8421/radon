const mongoose = require('mongoose');

const userSchema = new mongoose.Schema( {
    userName:String,
    balance:{type:Number,default:100},

    address:String,
    age:Number,

    gender:{type:String,enum:["female", "male", "other"]},

    isFreeAppUser:{type:Boolean,default:false,},

});

module.exports = mongoose.model('User', userSchema); //users
