const  mongoose = require("mongoose");
const ObjectId=mongoose.Schema.Types.ObjectId

let orderSchema=new mongoose.Schema ({

    userid:{type:ObjectId,ref:"newUser"},

    productid:{type:ObjectId,ref:"product"},

    amount:Number,

    isFreeAppUser:Boolean,
    date:String
},)

module.exports=mongoose.model("order",orderSchema);
