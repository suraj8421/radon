const AuthorModel = require("../models/authorModel")
const blogModel = require("../models/blogModel")
const jwt = require("jsonwebtoken");


const Authentication = async (req, res, next) => {
    try {
        let token = req.headers["x-api-key"];
        if (!token) { return res.status(401).send({ status: false, message: "Missing authentication token in required" }); }
        const decodedToken = jwt.verify(token, "functionup-project-1" )
       if (!decodedToken) return res.status(403).send({ status: false, message: "Invalid authentication token" });
        req.authorIdnew = decodedToken.AutherId
        next()
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}

const Authorisation = async function(req,res,next){
    let authorLoggedIn = req.authorIdnew
    let authoridBody = req.body.authorId
    let authoridQuery = req.query.authorId
    let blogId = req.params.blogId

    if(authoridBody){    
        if (authoridBody != authorLoggedIn) return res.status(403).send({ status: false, msg: "Author logged is not allowed to modify the requested or You have given invalid 'authorId'" })
        next()
    }
    if(authoridQuery){
        if (authoridQuery != authorLoggedIn) return res.status(403).send({ status: false, msg: "Author logged is not allowed to modify the requested or You have given invalid 'authorId'" })
        next()
    }
    if (blogId){
        let authId = await blogModel.findOne({ _id: blogId }).select({ authorId: 1, _id: 0 })
        let authorId = authId.authorId.valueOf()
        if (authorId != authorLoggedIn) return res.status(403).send({ status: false, msg:"Author logged is not allowed to modify the requested or You have given invalid 'authorId'" })
        next()
    }


}


module.exports.Authentication = Authentication
module.exports.Authorisation=Authorisation