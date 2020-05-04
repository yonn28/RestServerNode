const express = require('express');
const fs = require('fs');
const app = express();
const path = require('path');
const {verificarTokenImg} = require('../middlewares/autenticacion');


app.get('/imagen/:tipo/:img',verificarTokenImg,(req, res)=>{

    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImagen = path.resolve( __dirname,`../../uploads/${tipo}/${img}`);
 
    if(fs.existsSync(pathImagen)){
        res.sendFile(pathImagen);
     }else {
         let noImage = path.resolve(__dirname, '../assets/no-image.jpg');    
         return res.sendFile(noImage);
     }
   
})














module.exports = app;