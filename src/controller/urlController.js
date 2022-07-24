const urlModel = require("../model/urlModel");
const validUrl = require("valid-url");
const { default: mongoose } = require("mongoose");
const shortid = require("shortid");
const redis = require("redis");
const { promisify } = require("util");

//Connect to redis
const redisClient = redis.createClient(
    16606,  //port 
    "redis-16606.c212.ap-south-1-1.ec2.cloud.redislabs.com", //host 
    { no_ready_check: true }
);
redisClient.auth("fe9u0KwiUsxNoHQXetJVocl7goThvLPG", function (err) { //pw 
    if (err) throw err;
});

redisClient.on("connect", async function () {
    console.log("Connected to Redis..✔✔");
});


//1. connect to the server
//2. use the commands : 

//Connection setup for redis

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);// 



const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    if (typeof value === 'number') return false;
    return true;
};

const createUrl = async function (req, res) {
    try {
        let data = req.body
        if (!Object.keys(data).length)
            return res.status(400).send({ status: false, message: "Bad Request, Please enter the details in the request body. ❗" });
        const longUrl = data.longUrl
        if (!isValid(longUrl))
            return res.status(400).send({ status: false, message: "Long Url is required. ⚠️" });

        if (!validUrl.isWebUri(longUrl)) { //isweburi
            return res.status(400).send({ status: false, message: "Please enter valid LongUrl. ⚠️" });
        }

        let cachedlinkdata = await GET_ASYNC(`${req.body.longUrl}`) //-------------------------
        if (cachedlinkdata) {
            let change = JSON.parse(cachedlinkdata)
            return res.status(200).send({ status: true, msg: "data found in Redis ♻✔🟢", redisdata: change })
        }

        let uniqueUrl = await urlModel.findOne({ longUrl }).select({ _id: 0, __v: 0, createdAt: 0, updatedAt: 0 })
        if (uniqueUrl) {
            await SET_ASYNC(`${req.body.longUrl}`, JSON.stringify(uniqueUrl), "EX", 60*2);//---------------------------
            return res.status(200).send({ status: true, message: "This is already created ♻✅", data: uniqueUrl })
        }
        const urlCode = shortid.generate().toLowerCase()
        //if the Urlcode is already existm( rare purpouse)
        // urlCode="veb0rw5vu"
        const alreadyExistCode = await urlModel.findOne({ urlCode})
        if (alreadyExistCode) return res.status(400).send({ status: false, message: "It seems You Have To Hit The Api Again  ⚠" })
        const shortUrl = "http://localhost:3000/" + urlCode

        data.urlCode = urlCode
        data.shortUrl = shortUrl

        let Data = {
            longUrl: longUrl,
            shortUrl: shortUrl,
            urlCode: urlCode
        }

        let urlCreated = await urlModel.create(Data)
        await SET_ASYNC(`${longUrl}`, JSON.stringify(Data), "EX", 60 * 2)
        return res.status(201).send({ status: true, message: "Success ✔🟢", data: Data });

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });

    }
}

//********************************getApi ***********************************************************************//



 const redirectUrl = async function (req, res) {
    try {
        let urlCode = req.params.urlCode;
        let urlcache = await GET_ASYNC(`${urlCode}`);
        if (urlcache) {
            return res.status(302).redirect(urlcache);
        }
        const findUrlCode = await urlModel.findOne({ urlCode }).select({ createdAt: 0, updatedAt: 0, __v: 0, _id: 0 })
        if (!findUrlCode) return res.status(404).send({ status: false, message: "url code not Found ❗🚫" })
        await SET_ASYNC(`${urlCode}`, findUrlCode.longUrl);
        return res.status(302).redirect(findUrlCode.longUrl)

    } catch (error) {

        return res.status(500).send({ status: false, error: error.message });
    }
};
 module.exports = {createUrl,redirectUrl}