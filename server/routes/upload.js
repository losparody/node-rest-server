const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

// file system + path son nativos de node
const fs = require('fs');
const path = require('path');

app.use(fileUpload());


//...............................................................
// subimos archivo
//...............................................................
app.put('/upload/:tipo/:id', (req,res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;


    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
               message: 'No ha seleccionado archivos' 
            }
        });
    };

    let tiposValidos  = ['producto', usuario];
    if (tiposValidos.indexOf( tipo ) < 0 ) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son ' + tiposValidos
            }
        });
    };


    // el nombre 'archivo' es el valor puesto en el body del postman (OJO)
    let archivo = req.files.archivo;

    let extensionesValidas = ['png', 'jpg', 'bmp','jpeg'];
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.lenght(),-1];

    if (extensionesValidas.indexOf( extension ) < 0 ) {
        return res.status(400).json({
            ok:false, 
            err: {
                message: ' Las extensiones permitidas son ' + extensionesValidas,
                ext: extension 
            }
        });
    };

   // cambiar nombre al archivo
   let nombreArchivo = `${ id }-${ new Date().getMilliseconds()}.${ extension}`;
    
    // subir 
    archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, (err) => {
        if (err) {
            return res.status(500).json({
                ok:false ,
                err
            })
        };

        //
        if (tipo === 'usuarios') {
            imagenUsuario(id,res, nombreArchivo);
        } else {
            imagenProducto(id,res, nombreArchivo);
        };
       
    })
    
});


//.........................................................................
//
//.........................................................................
function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {

            borraArchivo(nombreArchivo, 'usuarios');

            return res.status(500).json({
                ok: false, 
                err
            });
        };

        if (!usuarioDB) {

            borraArchivo(nombreArchivo, 'usuarios');

            return res.status(400).json({
                ok: false ,
                err: {
                    message: 'El usuario no existe'
                }
            });
        };

        let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ usuarioDB.img }`);
        if (fs.existsSync()) {
            fs.unlinkSync(pathImagen);
        };

        borraArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img= nombreArchivo;
        usuarioDB.save( (err, usuarioGuardado)=> {
            res.json({
                ok: true ,
                usuario: usuarioGuardado
            });
        });
    });
}


//...............................................................
// imagen producto
//...............................................................
function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {

            borraArchivo(nombreArchivo, 'productos');

            return res.status(500).json({
                ok: false, 
                err
            });
        };

        if (!usuarioDB) {

            borraArchivo(nombreArchivo, 'productos');

            return res.status(400).json({
                ok: false ,
                err: {
                    message: 'El producto no existe'
                }
            });
        };

        borraArchivo(productoDB.img, 'productos');

        productoDB.img= nombreArchivo;
        productoDB.save( (err, productoGuardado)=> {
            res.json({
                ok: true ,
                producto: productoGuardado
            });
        });
    });
}


//...............................................................
// funciones adicionales
//...............................................................
function borraArchivo(nombreImagen, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ usuarioDB.img }`);
    if (fs.existsSync()) {
        fs.unlinkSync(pathImagen);
    };
}

module.exports = app;