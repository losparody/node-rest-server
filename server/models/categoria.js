const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;


let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    estado: {
        type: Boolean,
        default: true
    } 
});


categoriaSchema.methods.toJSON = function() {

    let categoria = this;
    let userObject = categoria.toObject();
    delete userObject.password;

    return userObject;
}


categoriaSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });


module.exports = mongoose.model('Categoria', categoriaSchema);