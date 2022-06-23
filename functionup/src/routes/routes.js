const express = require('express');
const router = express.Router();
const autherController= require("../controllers/authorController")
const blogController=require("../controllers/blogController")
const mid=require("../middleware/mid")


// Phase 1

router.post("/authors",mid.createAuthMid, autherController.createAuthor)

router.post("/blogs",mid.authenticate,mid.createBlogAuth,mid.blogSchemaValidation, blogController.createBlog)

router.get("/Blogs",blogController.getBlog)

router.put("/blogs/:blogId",mid.authenticate,mid.authorise,mid.authorIdValidation ,blogController.updateBlog)


router.delete("/blogs/:blogId",mid.authenticate,mid.authorise,mid.authorIdValidation, blogController.deleteBlog)


router.delete("/blogs",mid.authenticate,mid.delteBlogAuthByQP,mid.deleteByParMid,blogController.deleteBlogByParams )


// Phase 2

router.post("/loginAuthor",mid.checkEmailandPassword, autherController.loginAuthor)



module.exports = router;
