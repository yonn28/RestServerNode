var express = require('express');
var app = express();



//look, routes that comes from the user URL
app.use(require('./usuario.js'));

//look, for routes login.
app.use(require('./login.js'));


module.exports = app