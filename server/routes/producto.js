const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');
let app = express();
let producto = require('../models/producto');

app.get('/productos', verificaToken, (req,res) => {
    //traer todos los productos con usuario y categoria. 
    // paginado
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .populate('usuario','nombre email')
        .populate('categoria','descripcion')
        .exec((err, productos) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        Producto.count({ disponible: true }, (err, conteo) => {
            res.json({
                ok: true,
                productos,
                cuantos: conteo
            });
        });

    });
})


app.get('/productos/:id',verificaToken,(req, res) => {
    let id = req.param.id;

    Producto.findbyID(id)
        .populate('usuario','nombre email')
        .populate('categoria','descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                   ok: false,
                   err: {
                       message: 'Producto inexistente'
                   } 
                });
            }

            res.status(201).json({
                ok:true,
                producto: productoDB
            });
        });

})



app.post('productos',verificaToken, (req, res) => {

    let body = req.body;

    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible ,
        categoria: body.categoria
    });

    producto.save( (err,productoDB) => {

        if (err) {
            return res.status(500).json({
                ok:false,
                err
            });
        };

        res.status(201).json( {
            ok:true,
            producto: productoDB
        });

    });
});

//..................................................
// PUT - actualizacion del producto
//..................................................
app.put('producto/:id',verificaToken, (req, res) =>{
    let id = req.param.id;

    Producto.findbyID((err, productoDB)=> {
        if (err) {
            return res.status(500).json({
                ok:false,
                err
            })
        }
        if (!productoDB) {
            return res.status(400).json({
                ok:false,
                err: {
                    message:' El producto NO existe'
                }
            });
        }

        productoDB.nombre = body.nombre;
        productoDB.descripcion = body.descripcion;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;

        productoDB.save((err,productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok:false ,
                    err
                });
            }
            res.json({
                ok:true ,
                producto: productoGuardado
            });
        })
    })
})


app.delete('producto/:id',verificaToken,(req, res) =>{

    let id = req.params.id;

    let cambiaEstado = {
        disponible: false
    };

    Producto.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, productoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!productoBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoBorrado, 
            message: 'Producto Borrado logicamente'
        });
    });
})



app.get('/productos/buscar/:termino',verificaToken, (req, res) => {

    let termino = req.params.termino;

    // busca en cualquier lado del nombre con la expresion regular.
    // la 'i' es para que sea insensible a mayusc/minusc.
    let regex = new RegExp(termino,'i');
    
    Producto.find({nombre: regex})
        .populate('categorias','nombre')
        .exec((err,productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok:true,
                productos: productos
            });
        })
})

module.exports = app;
