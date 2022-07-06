const express = require('express');
const router = express.Router();
const userController= require("../controllers/userController");
const bookController = require("../controllers/bookController");


router.post("/register", userController.createUser);
router.post("/books", bookController.createBook);
//router.get("/functionup/collegeDetails", collegeController.getCollegeAndInternsDetails);


module.exports = router;