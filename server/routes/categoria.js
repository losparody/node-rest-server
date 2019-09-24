const express = require('express');

const Categoria = require('../models/categoria');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

const app = express();

app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario','nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({ok:false, err});
            }
            res.json({
                ok:true,
                categorias: categorias
            });
        })
      
       
});

app.get('/categoria/:id',verificaToken, (req, res) => {
    
    let id = req.params.id ;

    Categoria.findById(id,(err, CategoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            });
        }
        if (!CategoriaDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'La Categoria no existe'
                }
            });
        }
    })
});

app.post('/categoria', [verificaToken, verificaAdmin_Role], function(req, res) {

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        estado: false
    });


    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });


});

app.put('/categoria/:id', [verificaToken, verificaAdmin_Role], function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['descripcion', 'estado']);

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }



        res.json({
            ok: true,
            categoria: categoriaDB
        });

    })

});

app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], function(req, res) {
    let id = req.params.id;
    let cambiaEstado = {estado: false};

    Categoria.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, categoriaBorrada) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBorrada
        });
    });
});
module.exports = app;