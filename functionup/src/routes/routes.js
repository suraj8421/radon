const express = require('express');
const router = express.Router();
const autherController= require("../controllers/authorController")
const blogController=require("../controllers/blogController")



router.post("/authors", autherController.createAuthor)

router.post("/blogs", blogController.createBlog)

router.put("/blogs/:blogId",blogController.updateBlog)
module.exports = router;
