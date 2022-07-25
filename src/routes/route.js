const express = require('express');
const router = express.Router();
const {createUser} = require("../controllers/userController")


router.post("/register", createUser)
// router.get("/:urlCode", getUrl)


router.all("/*", function (req, res) {
    res.status(400).send({ status: false, message: "This URL is not valid" })
})


module.exports = router;