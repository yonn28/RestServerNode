// configure server and port!!
require('./config/config.js');

var express = require('express');
const mongoose = require('mongoose');

var app = express();
const path= require('path')

//for you to know what is inside the payload in http POST
const bodyParser = require('body-parser')


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json the body
app.use(bodyParser.json())

//habilitar la carpeta de public
app.use(express.static( path.resolve(__dirname , '../public')));

//all routes posibles
app.use(require('./routes/index.js'));




// mongoose.set('useCreateIndex', true)
mongoose.connect(process.env.URLDB,{useNewUrlParser: true,useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false} ,(err) => {
  if(err) throw err;
  console.log('Base de datos ONLINE');
});


app.listen(process.env.PORT, function () {
  console.log('Example app listening on port 3000!');
});