const express = require('express');
const app = express();
const bcypt = require('bcrypt');
const _ = require('underscore');
const jwt = require('jsonwebtoken');

const {GoogleAuth} = require('google-auth-library');
const client = new GoogleAuth(process.env.CLIENT_ID);


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
});


// Configs de Google
async function verify( token ) {
    const ticket = await client.verifyIdToken({
        idtoken: token,
        audience: process.env.CLIENT_ID
    });
    const payload = ticket.getPayLoad();
    return {
        name: payload.name,
        email: payload.email,
        image: payload.picture,
        google: true
    };
};


app.post('/google', async(req,res) =>{
   
   let token = req.body.idtoken;
   let googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: e
            })
        });
    res.json({
        usuario: googleUser
    });

});

module.exports = app;