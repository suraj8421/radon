require("dotenv").config()
const express = require('express')
const bodyparser = require('body-parser')
const route = require('./routes/route.js')
const {default: mongoose} = require('mongoose')
const app = express()

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended: true}))

mongoose.connect("mongodb+srv://Birappa:MangoDB@cluster0.m5phg.mongodb.net/group19Database?retryWrites=true&w=majority", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )


app.use('/', route)


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});