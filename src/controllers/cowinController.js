let axios = require("axios")


let getStates = async function (req, res) {

    try {
        let options = {
            method: 'get',
            url: 'https://cdn-api.co-vin.in/api/v2/admin/location/states'
        }
        let result = await axios(options);
        console.log(result)
        let data = result.data
        res.status(200).send({ msg: data, status: true })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message })
    }
}


let getDistricts = async function (req, res) {
    try {
        let id = req.params.stateId
        let options = {
            method: "get",
            url: `https://cdn-api.co-vin.in/api/v2/admin/location/districts/${id}`
        }
        let result = await axios(options);
        console.log(result)
        let data = result.data
        res.status(200).send({ msg: data, status: true })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message })
    }
}

let getByPin = async function (req, res) {
    try {
        let pin = req.query.pincode
        let date = req.query.date
        console.log(`query params are: ${pin} ${date}`)
        var options = {
            method: "get",
            url: `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=${pin}&date=${date}`
        }
        let result = await axios(options)
        console.log(result.data)
        res.status(200).send({ msg: result.data })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message })
    }
}

let getOtp = async function (req, res) {
    try {
        let blahhh = req.body
        
        console.log(`body is : ${blahhh} `)
        var options = {
            method: "post",
            url: `https://cdn-api.co-vin.in/api/v2/auth/public/generateOTP`,
            data: blahhh
        }

        let result = await axios(options)
        console.log(result.data)
        res.status(200).send({ msg: result.data })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message })
    }
}

let getDistrictSessions = async function (req,res){
    try {
        let district = req.query.districtid
        let date =req.query.date
        let options = {
            method:"get",
            url: `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id= ${district}&date=${date}`


        }

            let result = await axios(options)
            console.log(result.data)
            res.status(200).send({ msg: result.data })


        }
        catch (err) {
            console.log(err)
            res.status(500).send({ msg: err.message })
        }
    }

 let getSortedCities = async function(req,res){
try{
let cities= ["Bengaluru","Mumbai", "Delhi", "Kolkata", "Chennai", "London", "Moscow"]
let citiObjectArray =[]
for (i=0;i<cities.length;i++) {
    let obj ={city:cities[i]  }
    let resp= await axios.get( 'http://api.openweathermap.org/data/2.5/weather?q=London&appid=8ad99db00cf86363311f25573f194ee7 ')  
    console.log (resp.data.main.temp)
    obj.temp = resp.data.main.temp
    citiObjectArray.push(obj)
    let sorted = citiObjectArray.sort(function(a,b){return a.temp - b.temp})
    console.log(sorted)
    res.status(200).send({status:true,data:sorted})
}

}
catch (err) {
    console.log(err)
    res.status(500).send({ msg: err.message })
}
 }

let memeCreater = async function(req,res){
    try{
        let option ={
            method:"post",
            url: 'http://api.imgfhttpslip.com/caption_image?name=ChangeMyMind&id=129242436'
        }
        let result= await axios(option)

        res.send({data: result.data})

    }
    catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message })
    }
}
 



module.exports.getStates = getStates
module.exports.getDistricts = getDistricts
module.exports.getByPin = getByPin
module.exports.getOtp = getOtp
module.exports.getDistrictSessions = getDistrictSessions
module.exports.getSortedCities =getSortedCities
module.exports.memeCreater =memeCreater