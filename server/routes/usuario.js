const express = require('express');
const app = express();
const bcypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuario');


// urls
app.get('/usuarios', function (req, res) {
    
    let desde = req.query.body;
    let limit = req.query.limit;

    Usuario.find({ estado: true }, 'Nombre Email Role Estado Google Img')
        .skip(desde)
        .limit(limit)
        .exec((err,usuarios) =>{ 
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }   
            Usuario.count({estado: true},(err,conteo) => {
                return res.json({
                    ok:true,
                    usuarios,
                    cuantos: conteo 
                });
            });
        })         
  })
  

/* app.get('/', function (req, res) {
    res.json('getusuario');
})
 */

app.post('/usuario', function (req, res) {
    
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        role: body.role,
        password:bcrypt.hashsync(body.password,10)
    });

    usuario.save( (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({ok:false, err});
        };
// si es correcto  devuelve todo el objeto
        res.json({
            ok:true,  
            usuario:usuarioDB
        });
    })
    
})

app.put('/usuario/:id', function (req, res) {
    
    let id = req.params.id;
    
    //let body = req.body;
    // con underscore.pick solo habilitamos aquellos campos actualizables.
    let body = _pick(req.body,['nombre','email','img','role','estado']);

    Usuario.findByIdAndUpdate(id ,{new: true, runValidators: true }, body,(err, usuarioDB)=> {
        if (err) {
            return res.status(400).json({ok:false, err});
        };

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    })
})

app.delete('/usuario:id', function (req, res) {
    let id = req.params.id;
    
    //Usuario.findByIdAndRemove(id,(err,usuarioBorrado) => {
    
    let cambiaEstado = { estado:false};

    Usuario.findByIdAndUpdate(id ,{new: true }, cambiaEstado,(err, usuarioDB)=> {
        if (err) {
            return res.status(400).json({ok:false, err});
        };

        if ( !usuarioBorrado ) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Usuario no encontrado'
                }
            }); 
        }

        res.json({
            ok: true ,
            usuarioBorrado
        });
        
    })
})

module.exports = app;
