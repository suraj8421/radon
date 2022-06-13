const express = require('express');
const bodyParser = require('body-parser');
const route = require('./routes/route.js');
const { default: mongoose } = require('mongoose');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect("mongodb+srv://Birappa:MangoDB@cluster0.m5phg.mongodb.net/suraj8421", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )

let globalMiddleware = function(req, res, next){
    let currentDate = new Date()
    
    let contentTypeHeader = req.headers["content-type"]
    let name = "functionup"
    req.headers.organisation = name
    let checkUser="true"
    req.headers.isFreeAppUser=checkUser
    
    res.setHeader('isFreeAppUser','true')
    
    req.newAtribute = 'India'

    next()
}

app.use('/', route);


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});
