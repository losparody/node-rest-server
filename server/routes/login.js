const express = require('express');
const app = express();
const bcypt = require('bcrypt');
const _ = require('underscore');
const jwt = require('jsonwebtoken');

app.post('/login', function (req, res) {

        let body = req.body
        Usuario.findOne({ email: body.email}, (err, usuarioDB) =>{
            if (err) {
                return res.status(500,json({ok:false, err}));
                }

            if (!usuarioDB) {
                return res.status(400).json({ok:false, err:{message: 'USUARIO o contraseña incorrecto'}});
            }
            if (!bcrypt.compareSync( body.password, usuarioDB.pass)) {
                return res.status(400).json({ok:false, err:{message: 'Usuario o CONTRASEÑA incorrecto'}});
            }

            let token = jwt.sign({usuarioDB},process.env.TOKEN_SEED,{expiresIn: process.env.TOKEN_CADUCIDAD});

            res.json({
                ok:true,
                usuario: usuarioDB ,
                token: token 
            });
        });
})










module.exports = app;