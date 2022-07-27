const express = require('express');
const router = express.Router();
const { createUser, userLogin, getProfile, updateUserProfile } = require("../controllers/userController")
const {authentication,autherization}= require('../middleware/auth')
const { createProduct } = require("../controllers/productController")

//////////////////*FEATURE 1 - User  ApI's*////////////////////////////////
router.post("/register", createUser)
router.post("/login", userLogin)
router.get("/user/:userId/profile",authentication, getProfile)
router.put("/user/:userId/profile",authentication,autherization, updateUserProfile)


//////////////////*FEATURE 2 - Product ApI's*///////////////////////////////
router.post("/products", createProduct)





router.all("/*", function (req, res) {
    res.status(400).send({ status: false, message: "This URL is not valid" })
})


module.exports = router;