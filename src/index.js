const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const route = require("./route/route")
const app = express()

app.use(bodyParser.json())

mongoose.connect("mongodb+srv://subhamsidharth:2NoDZjzEUgRaFunQ@cluster0.f3bng.mongodb.net/group74Database?retryWrites=true&w=majority", { useNewUrlParser: true })
.then(() => console.log("MongoDb Connected..."))
.catch(err => console.log(err))

app.use("/", route)

app.listen(3000, () =>
    console.log("Express App Is Running On 3000")
)