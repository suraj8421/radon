const jwt = require("jsonwebtoken");
const { now } = require("mongoose");
//////////////////////////////////////authentication///////////////////////////////////////
const authentication = function(req, res, next) {
    try {
        const token = req.headers[`x-api-key`]
        if (!token) return res.status(400).send({ status: false, msg: "Token must be present in Headers" });
        let decodedToken = jwt.verify(token, "ASDFGH3456OKJNBDCFGHJ")
        if ((!decodedToken)) return res.status(400).send({ status: false, msg: "please enter valid token" })
            //if (Date.now() > decodedToken * 1000) return res.status(401).send({ status: false, message: "login expired" })
        req.decodedToken = decodedToken
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }

    next()
}
module.exports = { authentication }