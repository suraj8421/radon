const express = require('express');
const router = express.Router();
const autherController= require("../controllers/authorController")
const blogController=require("../controllers/blogController")
const mid=require("../middleware/mid")
const Vald=require("../validation/validation.js")


//                                     Phase : 1

//                            Create authors  : API - 1
router.post("/authors",Vald.createAuthMid, autherController.createAuthor)


//                             Create blogs  : API - 2
router.post("/blogs",mid.Authentication,mid.Authorisation,Vald.blogSchemaValidation, blogController.createBlog)


//                              Get blogs  : API - 3
router.get("/blogs", mid.Authentication, blogController.getBlog)


//                             Update blog  : API - 4
router.put("/blogs/:blogId",mid.Authentication,mid.Authorisation,Vald.blogIdValidation ,blogController.updateBlog)


//                         Delete blog by blogId  : API - 5
router.delete("/blogs/:blogId",mid.Authentication,mid.Authorisation,Vald.blogIdValidation, blogController.deleteBlog)


//                       Delete blog by query params  : API - 6
router.delete("/blogs",mid.Authentication,mid.Authorisation,Vald.deleteByParMid,blogController.deleteBlogByParams )


//                                   Phase : 2

//             Generate JWT and login for authors  : API - 2.1
router.post("/login",Vald.checkEmailandPassword, autherController.loginAuthor)



module.exports = router;
