const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');

// default options
app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', function(req, res) {

  let tipo = req.params.tipo;
  let id = req.params.id;


  if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            message: 'no se ha seleccionado ningun archivo'
        });
  }

  //Valida tipo
  let tiposValidos = ['producto','usuario']

  if(tiposValidos.indexOf(tipo)<0){
      return res.status(400).json({
        ok:false,
        err: {
            message:'los tipos validos son:' + tiposValidos.join(','),         
        }
    })
  }

  // The name of the input field (i.e. "archivo") is used to retrieve the uploaded file
  let archivo = req.files.archivo;
  let nombreArchivo = archivo.name.split(".");
  let extension = nombreArchivo[nombreArchivo.length - 1]

//   console.log(extension);
  let extensionesValidas = ['png', 'jpg', 'gif','jpeg'];

  if(extensionesValidas.indexOf(extension)<0){
        return res.status(400).json({
            ok:false,
            err: {
                message:'las exensiones validas son' + extensionesValidas.join(','),
                extension
            }
        })
  }

  //cambiar el nombre del archivo
  let nombreArchivoGuardar = `${id}-${new Date().getMilliseconds() }.${extension}`


  // Use the mv() method to place the file somewhere on your server
  archivo.mv(`uploads/${tipo}/${nombreArchivoGuardar}`, (err) => {
    if (err)
      return res.status(500).json({
          ok:false,
          err
      });

    //aqui, imagen cargada 
    if(tipo == 'usuario' ){
      imagenUsuario(id, res, nombreArchivoGuardar);
    }else{
      imagenProducto(id, res,nombreArchivoGuardar);
    }




  });
});

function imagenUsuario(id, res,nombrearchivo){

  Usuario.findById(id,(err, usuarioDB)=>{

      if(err){
        borraArchivo(nombrearchivo, 'usuario');
        return res.status(500).json({
          ok:false,
          err
        });
      }

      
      if(!usuarioDB){
        borraArchivo(nombrearchivo, 'usuario');
        return res.status(400).json({
          ok:false,
          err:{
            message:'Usuario no existe !'
          }
        }); 
      }

      borraArchivo(usuarioDB.img, 'usuario');

      usuarioDB.img = nombrearchivo;

      usuarioDB.save((err, usuarioGuardado)=>{
        if(err){
           return res.status(500).json({
             ok:false,
             err
           })
        }
        res.json({
            ok:true,
            usuarioGuardado,
            img: nombrearchivo
        })

      })
  })

}

function imagenProducto(id, res, nombrearchivo){

  Producto.findById(id,(err, productoDB)=>{
    if(err){
      borraArchivo(nombrearchivo, 'producto');
      return res.status(500).json({
        ok:false,
        err
      });
    }

    
    if(!productoDB){
      borraArchivo(nombrearchivo, 'producto');
      return res.status(400).json({
        ok:false,
        err:{
          message:'Producto no existe !'
        }
      }); 
    }

    borraArchivo(productoDB.img, 'producto');

    productoDB.img = nombrearchivo;

    productoDB.save((err, productoGuardado)=>{
      if(err){
         return res.status(500).json({
           ok:false,
           err
         })
      }
      res.json({
          ok:true,
          productoGuardado,
          img: nombrearchivo
      })

    })
  })

}

function borraArchivo(nombreImagen, tipo){

  let pathImagen = path.resolve( __dirname,`../../uploads/${tipo}/${nombreImagen}`);

  if(fs.existsSync(pathImagen)){
     fs.unlinkSync(pathImagen);
  }

}

module.exports = app