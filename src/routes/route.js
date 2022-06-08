const express = require('express');
const router = express.Router();
const UserModel= require("../models/userModel.js")
const UserController= require("../controllers/userController")

router.post("/createBook", UserController.createBook)

router.get("/getBooksData", UserController.getBooksData)

router.get("/yearDetails", UserController.yearDetails)

router.get("/particularBooks", UserController.particularBooks)

router.get("/priceDetails", UserController.priceDetails)

router.get("/randomBooks", UserController.randomBooks)


module.exports = router;
