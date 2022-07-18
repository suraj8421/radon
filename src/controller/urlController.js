const urlModel = require("../model/urlModel")
const validUrl = require("valid-url")
const { default: mongoose } = require("mongoose")
const shortid = require("shortid")


const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
};

module.exports.createUrl = async function (req, res) {
    try {
        let data = req.body
        if (!Object.keys(data).length)
            return res.status(400).send({ status: false, message: "Bad Request, Please enter the details in the request body." });
        const longUrl = data.longUrl
        if (!isValid(longUrl))
            return res.status(400).send({ status: false, message: "Long Url is required. ⚠️" });

        if (!validUrl.isUri(longUrl)) {
            return res.status(400).send({ status: false, message: "Please enter valid LongUrl. ⚠️" });
            }
       
    
        let uniqueUrl=await urlModel.findOne({longUrl}).select({_id:0,__v:0,createdAt:0,updatedAt:0})
        if (uniqueUrl){
            return res.status(200).send({status:true,data:uniqueUrl})
        }
        const urlCode = shortid.generate().toLowerCase()
        const shortUrl = "http://localhost:3000/" + urlCode

        data.urlCode = urlCode
        data.shortUrl = shortUrl

        let Data = {
            longUrl: longUrl,
            shortUrl: shortUrl,
            urlCode: urlCode
        }
        console.log(Data)
    
        let urlCreated = await urlModel.create(Data) //.select({_id:0,_v:0,createdAt:0,updatedAt:0})
        return res
            .status(201)
            .send({ status: true, message: "Success", data: urlCreated });

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });

    }
}

//********************************getApi ***********************************************************************

// module.exports.redirectUrl= async function (req,res){
//     try {
//         const urlCode=req.params.urlCode
//         let demo= await GET_ASYNC(urlCode)
//         let useNewUrlParser=JSON.parse(demo)
//         if (!useNewUrlParser){
//             const findUrl=await urlModel.findOne({urlCode:urlCode})
//             if (!findUrl){
//                 return res.status (404).send ({status:false, message:"No Url found"}) 
//             }
//         }
       
       
//         // const findLongUrl =findUrl.longUrl
//         // if (findUrl){
//         //     return res.status(302).redirect(findLongUrl)
            
//         // }else{
//         //     return res.status (404).send ({status:false, message:"No Url found"})
//         // } 

        
//         await SET_ASYNC(`${urlCode}`,JSON.stringify (findurl.longUrl))
//         return res.status(302).redirect(useNewUrlParser)
            
//     } catch (error) {
//         console.log(error)
//         return res.status(500).send({ status: false, message: error.message, errorName:error.errorname });
//     }
// }

module.exports.redirectUrl = async function (req, res) {
    try {
      let urlCode = req.params;
  
      const findUrlCode = await urlModel.findOne(urlCode).select({ createdAt: 0, updatedAt: 0, __v: 0, _id: 0 })
  
      if(!findUrlCode) return res.status(400).send({status: false, message: "url code not matched"})

      return res.status(302).redirect(findUrlCode.longUrl)
  
    } catch (error) {
      
        return  res.status(500).send({ status: false, error: error.message });
    }
  };
// module.exports = (createUrl)