const express = require('express');
const router = express.Router();
const autherController= require("../controllers/authorController")
const blogController=require("../controllers/blogController")
const mid=require("../middleware/mid")
const Vald=require("../validation/validation.js")


// Phase 1

router.post("/authors",Vald.createAuthMid, autherController.createAuthor)

router.post("/blogs",mid.Authentication,mid.Authorisation,Vald.blogSchemaValidation, blogController.createBlog)

router.get("/blogs",blogController.getBlog)

router.put("/blogs/:blogId",mid.Authentication,mid.Authorisation,Vald.authorIdValidation ,blogController.updateBlog)


router.delete("/blogs/:blogId",mid.Authentication,mid.Authorisation,Vald.authorIdValidation, blogController.deleteBlog)


router.delete("/blogs",mid.Authentication,mid.Authorisation,Vald.deleteByParMid,blogController.deleteBlogByParams )


// Phase 2

router.post("/loginAuthor",Vald.checkEmailandPassword, autherController.loginAuthor)



module.exports = router;
