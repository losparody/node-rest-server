const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');



let Schema = mongoose.Schema;

let rolesValidos = {
    values: [
        'ADMIN_ROLE',
        'SUPER_ROLE',
        'MASTER_ROLE',
        'USER_ROLE'
    ],
    message:'{VALUE} no es un ROL valido'
};


let usuarioSchema = new Schema({
    nombre:{
        type: String,
        required: [true,'Nombre obligatorio']
    },
    email:{
        type: String,
        required: [true,'El email ese obligatorio']
    },
    password:{
        type : String,
        unique: true ,
        required:[true,'La contraseña es obligatoria']
    },
    img:{
        type: String,
        required: false
    },
    role:{
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado:{
        type: Boolean,
        default: true
    },
    google:{
        type: Boolean,
        default: false
    }
});


// estea funcion es para eliminar del json de respuesta el campo password
// (nombre + contenido) para que no sea visto desde afuera. 
usuarioSchema.methods.TOJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

usuarioSchema.plugin(uniqueValidator,{message: '{PATH} debe ser unico'});

module.exports = mongoose.model('Usuario', usuarioSchema);
