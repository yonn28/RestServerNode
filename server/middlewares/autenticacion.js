const jwt = require('jsonwebtoken');


//==================
//verificar Token
//==================

let verificarToken = (req,res,next) =>{
    let Token = req.get('token'); 
    jwt.verify(Token, process.env.SEED,(err,decoded)=>{
        if(err){
            return res.status(401).json({
                ok:false,
                err:{
                    message: 'Token no valido'
                }
            })
        }
        req.usuario = decoded.usuario
        next();
    });
}

//===================
//verificar Admin rol
//==================

let verificarAdmin_Rol = (req,res,next) =>{
    let Usuario = req.usuario; 
    if(Usuario.role === 'ADMIN_ROLE'){
        next();
    }else{    
        return res.status(500).json({
            ok:false,
            err:{
                message: 'Rol no valido el usuario no es administrador'
            }
        })
    }
        

}


module.exports = { 
    verificarToken,
    verificarAdmin_Rol
}