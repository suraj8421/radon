const express = require('express');
const router = express.Router();
const { createUser, userLogin, getProfile } = require("../controllers/userController")


router.post("/register", createUser)
router.post("/login", userLogin)
router.get("/user/:userId/profile", getProfile)



router.all("/*", function (req, res) {
    res.status(400).send({ status: false, message: "This URL is not valid" })
})


module.exports = router;