var express = require('express');
var app = express();
const bcrypt = require('bcrypt');
const _= require('underscore')
const Usuario  = require('../models/usuario');

const {verificarToken , verificarAdmin_Rol}= require('../middlewares/autenticacion')

app.get('/usuario',verificarToken, function (req, res) {

    let desde = Number(req.query.desde || 0);
    let hasta = Number(req.query.hasta || 5);
    // this is for limit the fields for update Not all are for update
    Usuario.find({estado:true}, 'nombre email role estado google img')
            .skip(desde)
            .limit(hasta)
            .exec((err, usuarios)=> {
                if(err){
                    return res.status(400).json({
                        ok:false,
                        error: err
                    })
                }
                Usuario.countDocuments({estado:true},(err, conteo)=>{
                    res.json({
                        ok: true,
                        usuarios,
                        cuantos:conteo
                    })
                })

            })

});


app.post('/usuario',[verificarToken,verificarAdmin_Rol], function (req, res) {

    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password,10),
        role: body.role
    });
    usuario.save( (err, ususarioDB)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                error: err
            })
        }
        // ususarioDB.password = null;

        res.json({
            ok: true,
            usuario: ususarioDB
        })
    });

});

app.put('/usuario/:id',[verificarToken ,verificarAdmin_Rol], function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body,['nombre','email','img','role','estado']);

    Usuario.findByIdAndUpdate(id, body ,{new:true, runValidators:true, context: 'query'},(err, ususarioDB)=>{   
        
        if(err){
            return res.status(400).json({
                ok:false,
                error: err
            })
        } 

        res.json({
            ok: true,
            usuario: ususarioDB
        });

    })

});


app.delete('/usuario/:id',[verificarToken ,verificarAdmin_Rol], function (req, res) {
    let id = req.params.id;

    let body = _.pick(req.body,['estado']);


    Usuario.findByIdAndUpdate(id, {estado:false} ,{new:true, runValidators:true, context: 'query'},(err, ususarioDB)=>{   
        
        if(err){
            return res.status(400).json({
                ok:false,
                error: err
            })
        } 

        res.json({
            ok: true,
            usuarioBorrado: ususarioDB
        });

    })


    /*Phisical delete from database*/
    // Usuario.findByIdAndRemove(id,{new:true, runValidators:true, context: 'query'},(err, ususarioBorrado)=>{   
        
    //         if(err){
    //             return res.status(400).json({
    //                 ok:false,
    //                 error: err
    //             });
    //         }; 

    //         if(ususarioBorrado == null){
    //             return res.status(400).json({
    //                 ok:false,
    //                 error: {
    //                     message: 'Usuario no encontrado'
    //                 }
    //             });
    //         }; 
    
    //         res.json({
    //             ok: true,
    //             usuario: ususarioBorrado
    //         });


    //     });

});


module.exports = app