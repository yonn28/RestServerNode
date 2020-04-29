const express = require('express');
let app = express();

let Categoria = require('../models/Categoria');

const {verificarToken , verificarAdmin_Rol}= require('../middlewares/autenticacion')

//================================
//Crear una categoria
//===============================
app.post('/categoria',[verificarToken,verificarAdmin_Rol],(req,res)=>{
    let body = req.body;
    let categoria = new Categoria({
        descripcion:body.descripcion,
        usuario:body.usuario._id
    });
    categoria.save((err, categoriaDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err      
            });
        }
        if(!categoriaDB){
            return res.status(400).json({
                ok:false,
                err
            })
        }
        res.json({
            ok:true,
            categoria:categoriaDB
        })

    });


})


//================================
//Mostrar todas las categorias
//===============================

app.get('/categoria',verificarToken,(req, res )=>{

    Categoria.find()
        .sort('descripcion')
        .populate('usuario','nombre email')
        .exec((err,categorias)=>{ 
            if(err){
                return res.status(400).json({
                    ok:false,
                    error: err
                })
            }
            res.json({
                ok:true,
                categorias
            });
        })

})

//=============================
//mostrar una categoria
//=============================

app.get('/categoria/:id',(req,res)=>{
    let id = req.params.id
    Categoria.findById(id, (err, categoria)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        if(!categoriaDB){
            return res.status(400).json({
                ok:false,
                err
            })
        }
        res.json({
            ok:true,
            categoria: categoria
        })
    })
})


//===========================
//actualizar una categoria
//===========================

app.put('/categoria/:id',verificarToken,(req, res)=>{
    let id = req.params.id
    let body = req.body;
    Categoria.findByIdAndUpdate(id,body,{new:true, runValidators:true, context: 'query'},(err, categoria)=>{
        if(err){
           return res.status(500).json({
                ok: false,
                err
            })
        }
        if(!categoria){
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok:true,
            categoria
        })

    })
})


//===========================
//borrar una categoria
//===========================

app.delete('/categoria/:id',[verificarToken,verificarAdmin_Rol],function(req,res){

    let id = req.params.id;
    // let id_body = req.body
    // console.log(id)
    Categoria.findByIdAndRemove(id ,(err,categoriaDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        if(!categoriaDB){
            return res.status(400).json({
                ok:false,
                err:{
                    msg:'la categoria no existe'                    
                }
            })
        }
        res.json({
            ok: true,
            usuario: categoriaDB
        })

    })
})



module.exports = app 