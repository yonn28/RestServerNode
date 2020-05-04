var express = require('express');
var app = express();


app.use(require('./categorias.js'));

//look, routes that comes from the user URL
app.use(require('./usuario.js'));

//look, for routes login.
app.use(require('./login.js'));

app.use(require('./producto.js'));


app.use(require('./uploads.js'));

app.use(require('./imagenes.js'));



module.exports = app