const express = require('express');
const app = express();
const _= require('underscore');
const {verificarToken } = require('../middlewares/autenticacion');
let Producto = require('../models/producto');



app.get('/productos',verificarToken,(req,res)=>{
    desde= Number(req.query.desde || 0);
    hasta = Number(req.query.hasta || 5);

    Producto.find({disponible:true})
            .skip(desde)
            .limit(hasta)
            .populate('usuario','nombre email')
            .populate('categoria','descripcion')
            .exec((err,productos)=>{
                if(err){
                    return res.status(400).json({
                        ok:false,
                        error:err
                    })
                }
                return res.json({
                    ok:true,
                    productos
                })
            })

})


app.get('/productos/:id',verificarToken, (req, res)=>{
    let id = req.params.id;
    Producto.findById(id)
            .populate('usuario', 'nombre email')
            .populate('categoria','nombre')
            .exec((err, producto)=>{
                    if(err){
                        return  res.status(500).json({
                            ok: false,
                            err
                        })
                    }
                    if(!producto){
                        return res.status(400).json({
                            ok:false,
                            err: {
                                message:`producto con id: ${id} no encotrado`
                            }
                        })
                    }
                    res.json({
                        ok:true,
                        producto
                    })
            })
})

app.get('/productos/buscar/:termino',verificarToken,(req,res)=>{
    let termino = req.params.termino;
    let regex = new RegExp(termino,'i')
    Producto.find({nombre:regex})
            .populate('categoria','nombre')
            .exec((err,productos)=>{
                if(err){
                    return res.status(500).json({
                        ok:false,
                        err
                    })
                }
    
                res.json({
                    ok:true,
                    productos
                })
            })

})



app.post('/productos/', verificarToken, (req,res)=>{
    let id = req.params.id;
    let body = req.body;
    let producto = new Producto({
        usuario: body.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    });
    
    producto.save((err,producto)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        return res.status(201).json({
            ok:true,
            producto
        })

    })
    

})


app.put('/productos/:id',(req,res)=>{
    let id = req.params.id;
    let body = req.body;
    console.log("entre aqui!!");
    Producto.findById(id,(err,productoBD)=>{

        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        if(!productoBD){
                return res.status(500).json({
                    ok: false,
                    message:{
                        mensaje: "No existe un producto con este id"
                    }
            });                
        }
       
       productoBD.nombre =   body.nombre;
       productoBD.precioUni =   body.precioUni;
       productoBD.categoria =   body.categoria;
       productoBD.disponible =  body.disponible;
       productoBD.descripcion = body.descripcion;

    
       productoBD.save((err,productoGuardado)=>{
            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                })
            }

            res.json({
                ok:true,
                productoGuardado
            })

       })

    })


})

app.delete('/productos/:id',(req,res)=>{

    let id = req.params.id;

    Producto.findByIdAndUpdate(id, {disponible:false} ,{new:true, runValidators:true, context: 'query'},(err, ProductoDB)=>{   
        
        if(err){
            return res.status(400).json({
                ok:false,
                error: err
            })
        } 

        res.json({
            ok: true,
            ProductoDB,
            mensaje:'Producto Borrado'
        });

    })
})



module.exports= app;