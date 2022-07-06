const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Tile is required'],
        enum: [Mr, Mrs, Miss],
        trim: true
    },
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    phone: {
        type: String,
        required: [true, 'Phone is required'],
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        //minLen 8, maxLen 15
    },
    address: {
        street: { type: String },
        city: { type: String },
        pincode: { type: String },
    }
}, { timestamp: true });

module.exports = mongoose.model("User", userSchema);