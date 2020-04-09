const mongoose = require('mongoose');
//give a more legitive message when your have an error
var uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let rolesValidos = {
    values: ['ADMIN_ROLE','USER_ROLE'],
    message: '{VALUE} no es un rol valido'
}

let usuarioShema = new Schema({
    nombre:{
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email:{
        type:String,
        unique: true,
        required:[true, 'El correo es necesario']
    },
    password:{
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img:{
        type:String,
        required:[false]
    },
    role:{
        type:String,
        default:'USER_ROLE',
        enum: rolesValidos
    },
    estado:{
        type:Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }

});
//this is for not send in response all informantion just necesary, don't send password
usuarioShema.methods.toJSON = function(){
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

//give a more legitive message when your have an error
usuarioShema.plugin(uniqueValidator,{message: '{PATH} deve ser unico'});
module.exports = mongoose.model('Usuario', usuarioShema)