const express = require('express');
const router = express.Router();
const autherController= require("../controllers/authorController")



router.post("/authors", autherController.createAuthor)

module.exports = router;
