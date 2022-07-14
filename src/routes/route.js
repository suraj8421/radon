const express = require("express"); // --> importing the express framework
const router = express.Router();
const bookController = require("../controllers/bookController")
const userController = require("../controllers/userController")
const reviewController = require("../controllers/reviewController")
const { authentication } = require("../middleware/auth")
const { testAWS } = require("../middleware/fileUpload")
// router.post("/test", testAWS)


router.post("/register", userController.createUser)
router.post("/login", userController.loginUser)

//////////////////////--> Using authentication form here////////////////////

router.post("/books", authentication, bookController.createBook)



router.get("/books", authentication, bookController.bookDetails)

router.get("/books/:bookId", authentication, bookController.getBookDetails)

router.put("/books/:bookId", authentication, bookController.updateBook)

router.delete("/books/:bookId", authentication, bookController.deleteBookById) ///*

///-->review apis
router.post("/books/:bookId/review", reviewController.createReview)

router.put("/books/:bookId/review/:reviewId", reviewController.updateReview)

router.delete("/books/:bookId/review/:reviewId", reviewController.deletReview )


router.all("/**", function (req, res) {
    res.status(400).send({ status: false, message: "This URL is not valid" })
})


module.exports = router;