const express = require("express"); // --> importing the express framework
const router = express.Router();
const bookController = require("../controllers/bookController")
const userController = require("../controllers/userController")
const { authentication } = require("../middleware/auth")

router.post("/register", userController.createUser)
router.post("/login", userController.loginUser)
router.post("/books", authentication, bookController.createBook)
router.get("/books", bookController.bookDetails)




module.exports = router;