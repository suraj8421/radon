const AuthorModel = require("../models/authorModel")
const blogModel = require("../models/blogModel")
const jwt = require("jsonwebtoken");

// Required regex : 
let userCheck = /^[a-z][a-z]+\d*$|^[a-z]\d\d+$/i;
let mailRegex = /^[a-zA-Z][a-zA-Z0-9\-\_\.]+@[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}$/;
let validPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;


// ton checking The Author Id Validation
const authorIdValidation = async function (req, res, next) {
    try {
        let blogId = req.params.blogId
        if (!blogId) return res.status(400).send({ msg: "blogId is need to be given" })

        if (blogId.length != 24) return res.status(400).send({ status: false, msg: "invalid blogId" })
        else {
            let isblog = await blogModel.findById(blogId)
            if (!isblog) return res.status(400).send({ status: false, msg: "No such user exists" })
        }
        next()
    }
    catch (error) {
        console.log("This is the error :", error.message)
        res.status(500).send({ msg: "Error", error: error.message })
    }
}

// To Checking The Validation Of Blog Model Schema
const blogSchemaValidation = async function (req, res, next) {
    try {
        let title = req.body.title
        if (!title) return res.status(400).send({ msg: "title is need to be given" })

        let body = req.body.body
        if (!body) return res.status(400).send({ msg: "body is need to be given" })

        let authorId = req.body.authorId
        if (!authorId) return res.status(400).send({ msg: "authorId is need to be given" })

        if (authorId.length != 24) return res.status(400).send({ status: false, msg: "invalid User Id" })
        else {
            let isAuthor = await AuthorModel.findById(authorId)
            if (!isAuthor) return res.status(400).send({ status: false, msg: "No such user exists" })
        }

        let category = req.body.category
        if (!category) return res.status(400).send({ status: false, msg: "category is need to required" })
        length = category.length
        if (length == 0) return res.status(400).send({ msg: "category is need to be given" })

        let subcategory = req.body.subcategory
        if (!subcategory) return res.status(400).send({ status: false, msg: "subcategory is need to required" })
        length = subcategory.length
        if (length == 0) return res.status(400).send({ msg: "subcategory is need to be given" })

        next()
    } catch (error) {
        console.log("This is the error :", error.message)
        res.status(500).send({ msg: "Error", error: error.message })
    }
}

// To checking The Validation Of Create Author Schema
const createAuthMid = async function (req, res, next) {
    try {
        // let title = req.body.title
        // if (!title) return res.status(404).send({ msg: " title is required " })
        // if (title != "Mr" || title != "Mrs" || title != "Miss") return res.status(400).send({ msg: "title must be Mr/Mrs/Miss" })


        let firstName = req.body.fname
        if (!firstName) return res.status(404).send({ msg: "first Name is required " })
        if (!firstName.match(userCheck)) return res.status(400).send({ msg: "first Name is not valid " })

        let lastName = req.body.lname
        if (!lastName) return res.status(404).send({ msg: "last Name is required " })
        if (!lastName.match(userCheck)) return res.status(400).send({ msg: "last Name is not valid " })

        let data = req.body;

        let email = req.body.email
        if (!email) return res.status(403).send({ msg: "email is required" })
        if (!email.match(mailRegex)) return res.status(400).send({ msg: "email is not valid" })

        let password = req.body.password
        if (!password) return res.status(403).send({ msg: "password is required" })
        if (!password.match(validPassword)) return res.status(400).send({ msg: "Password is not valid. Must be contain 1 UpperCase alphabet and minimum 8 elements and not allowed special character" })


        const autherMail = await AuthorModel.findOne({ email: data.email }); //email exist or not
        if (autherMail) { res.status(404).send({ status: false, msg: "Email already exist" }); }

        next()
    } catch (error) {
        console.log("This is the error :", error.message)
        res.status(500).send({ msg: "Error", error: error.message })
    }

}
// To checking the ValiDation of Delete By Param API
const deleteByParMid = async function (req, res, next) {
    try {
        const authorId = req.query.authorId
        const category = req.query.category
        const tages = req.query.tages
        const subcategory = req.query.subcategory
        const unpublished = req.query.isPublished
        if (!authorId) return res.status(400).send({ status: false, msg: "authorId is not given" })
        if (!category) return res.status(400).send({ status: false, msg: "category is not given" })
        if (!tages) return res.status(400).send({ status: false, msg: "tages is not given" })
        if (!subcategory) return res.status(400).send({ status: false, msg: "subcategory is not given" })
        if (!unpublished) return res.status(400).send({ status: false, msg: "unpublished is not given" })
        next()
    }
    catch (error) {
        console.log("This is the error :", error.message)
        res.status(500).send({ msg: "Error", error: error.message })
    }
}

// To checking User Is LogIn or Not
const authenticate = function (req, res, next) {
    try {
        let token = req.headers["x-auth-token"];
        if (!token) return res.send({ status: false, msg: "token must be present" });
        let decodedToken = jwt.verify(token, "functionup-project-1", function (err, data) {
            if (err) {
                return res.send({ status: false, msg: "token is invalid" });
            } else {
                next()
            }
        });
    } catch (error) {
        console.log("This is the error :", error.message)
        res.status(500).send({ msg: "Error", error: error.message })
    }
}

// for blog creation (2nd API)
const createBlogAuth= async function (req,res,next)
{
    let authorid = req.body.authorId
    let token = req.headers["x-auth-token"];
    let decodedToken = jwt.verify(token, 'functionup-project-1')
    let authorLoggedIn = decodedToken.authorid
    if (authorid != authorLoggedIn) return res.send({ status: false, msg: "Author logged is not allowed to modify the requested or You have given invalid 'authorId' " })
    next()
    
}
// For Delete By Param
const delteBlogAuthByQP= async function (req,res,next)
{
    let authorid = req.query.authorId
    let token = req.headers["x-auth-token"];
    let decodedToken = jwt.verify(token, 'functionup-project-1')
    let authorLoggedIn = decodedToken.AutherId
    if (authorid != authorLoggedIn) return res.send({ status: false, msg: "Author logged is not allowed to modify the requested or You have given invalid 'authorId' " })
    next()
    
}


//update Blog(3rd API) and Delete By Id (5th API)
const authorise = async function (req, res, next) {
    let blogId = req.params.blogId
    let token = req.headers["x-auth-token"];
    let decodedToken = jwt.verify(token, 'functionup-project-1')
    let authId = await blogModel.findOne({ _id: blogId }).select({ authorId: 1, _id: 0 })
    let authorId = authId.authorId.valueOf()

    let authorLoggedIn = decodedToken.AutherId
    if (authorId != authorLoggedIn) return res.send({ status: false, msg: "author logged is not allowed to modify the requested" })
    next()
}


// to checkinf Email validation at time of Login (2.1 API)
const checkEmailandPassword = async function (req, res, next) {

    let email = req.body.emailId;
    let password = req.body.password;
    if (!email) return res.status(400).send({ status: false, msg: "Email-Id is required" });
    if (!email.match(mailRegex)) return res.status(400).send({ msg: "Email-Id is not valid" })

    // if (!password) return res.status(400).send({ status: false, msg: "Password is required" });
    // if (!password.match(validPassword)) return res.status(400).send({ msg: "Password is not valid. Must be contain 1 UpperCase alphabet and minimum 8 elements and not allowed special character" })
    next()
}







module.exports.authorIdValidation = authorIdValidation
module.exports.blogSchemaValidation = blogSchemaValidation
module.exports.createAuthMid = createAuthMid
module.exports.deleteByParMid = deleteByParMid
module.exports.authenticate = authenticate
module.exports.authorise = authorise
module.exports.checkEmailandPassword = checkEmailandPassword
module.exports.createBlogAuth=createBlogAuth
module.exports.delteBlogAuthByQP=delteBlogAuthByQP
