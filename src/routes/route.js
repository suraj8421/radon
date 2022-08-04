const express = require('express');
const router = express.Router();
const { createUser, userLogin, getProfile, updateUserProfile } = require("../controllers/userController")
const {authentication,autherization}= require('../middleware/auth')
const { createProduct, getProduct, getproductDetails, deleteProduct ,updateProduct} = require("../controllers/productController")
const { createCart, updateCart, getCart, deleteCart } = require("../controllers/cartController")
const { createOrder, updateOrder } = require("../controllers/orderController")

//////////////////*FEATURE 1 - User  ApI's*////////////////////////////////
router.post("/register", createUser)
router.post("/login", userLogin)
router.get("/user/:userId/profile",authentication, getProfile)
router.put("/user/:userId/profile",authentication,autherization, updateUserProfile)


//////////////////*FEATURE 2 - Product ApI's*///////////////////////////////
router.post("/products", createProduct)
router.get("/products", getProduct)
router.put("/products/:productId",updateProduct)
router.get("/products/:productId", getproductDetails)
router.delete("/products/:productId", deleteProduct)



////////////////////*FEATURE 3 - Cart ApI,s*/////////////////////////////////

router.post("/users/:userId/cart", authentication, autherization, createCart )
router.put("/users/:userId/cart", authentication, autherization, updateCart)
router.get("/users/:userId/cart", authentication, autherization, getCart)
router.delete("/users/:userId/cart", authentication, autherization, deleteCart)


//////////////////////*FEATURE 4 - Order ApI's*///////////////////////////////
router.post("/users/:userId/orders", authentication, autherization, createOrder)
router.put("/users/:userId/orders", authentication, autherization, updateOrder)







router.all("/*", function (req, res) {
    res.status(400).send({ status: false, message: "This URL is not valid" })
})


module.exports = router;