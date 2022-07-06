const jwt = require("jsonwebtoken");
//////////////////////////////////////authentication///////////////////////////////////////
const authentication = function(req, res, next) {
    try {
        const token = req.headers[`x-api-key`]
        if (!token) return res.status(400).send({ status: false, msg: "Token must be present in Headers" });
        let decodedToken = jwt.verify(token, "ASDFGH3456OKJNBDCFGHJ")
        if ((!decodedToken)) return res.status(400).send({ status: false, msg: "please enter valid token" })

        req.userId = decodedToken.userId
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }

    next()
}
module.exports = { authentication }