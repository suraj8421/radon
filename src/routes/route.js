const express = require('express');
const router = express.Router();
const userController= require("../controllers/userController")
const Auth =require("../middleware/auth")

router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})

router.post("/users", userController.createUser)

router.post("/login", userController.loginUser)

//The userId is sent by front end
router.get("/users/:userId", Auth.authenticate, Auth.authorise, userController.getUserData)
router.post("/users/:userId/posts",Auth.authenticate, Auth.authorise, userController.postMessage)

router.put("/users/:userId",Auth.authenticate, Auth.authorise, userController.updateUser)
router.delete('/users/:userId',Auth.authenticate, Auth.authorise, userController.deleteUser)

module.exports = router;