const express = require('express');
const router = express.Router();
const autherController= require("../controllers/authorController")
const blogController=require("../controllers/blogController")
const mid=require("../middleware/mid")



router.post("/authors", autherController.createAuthor)

router.post("/blogs",mid.authorIdValidation, blogController.createBlog)

router.get("/Blogs",blogController.getBlog)

router.put("/blogs/:blogId",blogController.updateBlog)
module.exports = router;
