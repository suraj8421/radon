const express = require('express');
const router = express.Router();
const autherController= require("../controllers/authorController")
const blogController=require("../controllers/blogController")
const mid=require("../middleware/mid")



router.post("/authors",mid.createAuthMid, autherController.createAuthor)

router.post("/blogs",mid.blogSchemaValidation, blogController.createBlog)

router.get("/Blogs",blogController.getBlog)

router.put("/blogs/:blogId",mid.authorIdValidation ,blogController.updateBlog)

router.delete("/blogs/:blogId",mid.authorIdValidation, blogController.deleteBlog)

router.delete("/blogs", mid.deleteByParMid,blogController.deleteBlogByParams )
module.exports = router;
