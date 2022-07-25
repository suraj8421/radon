const express = require('express');
const bodyParser = require('body-parser');
const route = require('./routes/route');
const { default: mongoose } = require('mongoose');
const app = express();
const multer = require('multer')

app.use(bodyParser.json());
app.use(multer().any())
// app.use(bodyParser.urlencoded({ extended: true }));


let url = "mongodb+srv://Birappa:MangoDB@cluster0.m5phg.mongodb.net/group69Database"
mongoose.connect(url, {
    useNewUrlParser: true
})
    .then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err))

app.use('/', route);


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});