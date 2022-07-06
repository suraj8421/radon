const jwt = require("jsonwebtoken");
//////////////////////////////////////authentication///////////////////////////////////////
const authentication = function (req, res, next) {
    try {
        const token = req.headers[`x-api-key`]
        if (!token) return res.status(400).send({ status: false, msg: "Token must be present in Headers" });
        let decodedToken = jwt.verify(token,
            "ASDFGH3456OKJNBDCFGHJ",
            function (err, decodedToken) {
                if (err) {
                    return res.status(401).send({ status: false, message: "Token is NOT Valid" })
                }

                req.userId = decodedToken.userId
                next();
            })

    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}
module.exports = { authentication }