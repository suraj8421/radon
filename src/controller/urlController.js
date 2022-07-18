const urlModel = require("../model/urlModel")
const validUrl = require("valid-url")
const { default: mongoose } = require("mongoose")
const shortId = require("shortid")


const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
};

const createUrl = async function (req, res) {
    try {
        let data = req.body
        console.log(data)
        if (!Object.keys(data).length)
            return res.status(400).send({ status: false, message: "Bad Request, Please enter the details in the request body." });
        console.log("123")
        const longUrl = data.longUrl
        if (!isValid(longUrl))
            return res.status(400).send({ status: false, message: "Long Url is required. ⚠️" });
            console.log("234")

        if (!validUrl.isUri(longUrl))
            return res.status(400).send({ status: false, message: "Please enter valid LongUrl. ⚠️" });

        const urlCode = shortid.generate().toLowerCase()
        const shortUrl = "http://localhost:3000" + urlCode

        data.urlCode = urlCode
        data.shortUrl = shortUrl

        let Data = {
            longUrl: longUrl,
            shortUrl: shortUrl,
            urlCode: urlCode
        }
        console.log(Data)

        let urlCreated = await urlModel.create(Data);
        return res
            .status(201)
            .send({ status: true, message: "Success", data: urlCreated });

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });

    }
}

module.exports = (createUrl)