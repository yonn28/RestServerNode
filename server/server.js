// configure server and port!!
require('./config/config.js');

var express = require('express');
const mongoose = require('mongoose');

var app = express();

//for you to know what is inside the payload
const bodyParser = require('body-parser')


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

//look, routes that comes from the user URL
app.use(require('./routes/usuario.js'));


mongoose.set('useCreateIndex', true)
mongoose.connect(process.env.URLDB,{useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false} ,(err) => {
  if(err) throw err;
  console.log('Base de datos ONLINE');
});


app.listen(process.env.PORT, function () {
  console.log('Example app listening on port 3000!');
});