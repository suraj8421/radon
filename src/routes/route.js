const express = require("express"); // --> importing the express framework
const router = express.Router();
const bookController = require("../controllers/bookController")
const userController = require("../controllers/userController")

router.post("/register", userController.createUser)
router.post("/login", userController.loginUser)
router.post("/books", bookController.createBook)
router.get("/books", bookController.bookDetails)



module.exports = router;