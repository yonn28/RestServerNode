var express = require('express');
var app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario  = require('../models/usuario');

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

app.post('/login',(req, res)=>{
    let body = req.body;

    Usuario.findOne({email: body.email},(err, usuarioDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                error: err
            })
        }
        if(!usuarioDB){
            return res.status(400).json({
                ok:false,
                error: {
                    message: '(Usuario) o contraseña incorrectos'
                }
            })
        }

       if( !bcrypt.compareSync(body.password, usuarioDB.password)){
            return res.status(400).json({
                ok:false,
                error: {
                    message: 'Usuario o (contraseña) incorrectos'
                }
            })
       }
       let token = jwt.sign({
           usuario : usuarioDB
       },process.env.SEED , { expiresIn: process.env.CADUCIDAD_TOKEN });

       res.json({
            ok:true,
            usuario:usuarioDB,
            token: token

       })

    })

})

//configuraciones de google

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    

    // console.log(payload.name); 
    // console.log(payload.email);
    // console.log(payload.picture); 
    // If request specified a G Suite domain:
    //const domain = payload['hd'];

    return {
        nombre: payload.email,
        email: payload.email,
        img: payload.picture,
        google:true

    }
  }
  


app.post('/google',async (req, res)=>{
    

    let token = req.body.idtoken;

    if(!token){
        return res.status(500).json({
            ok: false,
            message:{
                message: "Recuerda enviar el token de google en el cuerpo de la solicitud si estas usando POSTMAN, en el navegador esto es automatico!"
            }
        }); 
    }

    let gooleUser = await verify(token).catch(e =>{
        return res.status(403).json({
            ok: false,
            err: e
        });
    })

    Usuario.findOne({email: gooleUser.email}, (err , usuarioDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                error: err
            });
        }
        if(usuarioDB){
            if(usuarioDB.google === false){
                return res.status(400).json({
                    ok:false,
                    message:"debe usar su autenticaion normal" 
                });
            } else {
                let token = jwt.sign({
                    usuario : usuarioDB
                },process.env.SEED , { expiresIn: process.env.CADUCIDAD_TOKEN });
         
                return res.json({
                     ok:true,
                     usuario:usuarioDB,
                     token: token
         
                });
            }
        }else{
            //si el usuario no existe en nuestra base de datos
            let usuario = new Usuario();

            usuario.nombre = gooleUser.nombre;
            usuario.email = gooleUser.email;
            usuario.img = gooleUser.img;
            usuario.google = true;
            usuario.password = ';)';
            
            usuario.save((err, usuarioDB)=>{
                if(err){
                    return res.status(500).json({
                        ok:true,
                        usuario:usuarioDB,
                        error: err
                    });
                } 
                let token = jwt.sign({
                    usuario : usuarioDB
                }, process.env.SEED , { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                        ok:true,
                        usuario:usuarioDB,
                        token: token
                });
                

                
            })
        }
    });

})


module.exports = app