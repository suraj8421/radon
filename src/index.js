const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
// const route = require('./route/route');


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect('mongodb+srv://subhamsidharth:2NoDZjzEUgRaFunQ@cluster0.f3bng.mongodb.net/group74Database?retryWrites=true&w=majority', {
  useNewUrlParser: true
})
.then(function(){
  console.log("Mongodb is connected successfully.");
})
.catch(function(err){
  console.log(err)
})

// app.use('/', route);

app.listen(process.env.PORT || 3000, function(){
  console.log('Your app is running at port', process.env.PORT || 3000);
})