const express = require('express');
const router = express.Router();

const UserController= require("../controllers/userController")
const orderController= require("../controllers/orderController")
const productController= require("../controllers/productController")


let mid1=function(req,res,next){
    let isFreeAppUser=req.headers["isfreeappuser"]
    if(isFreeAppUser != undefined){
        console.log("done")
        next()
    }
    else{
        res.send("request is missing a mandatory header")
    }
}


router.post("/createUser",mid1, UserController.createUser  )
router.post("/createOrder",orderController.createOrder)
router.post("/createProduct", productController.createProduct)


module.exports = router;