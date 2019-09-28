const express = require('express');
const fs = require('fs');

const { verificaToken } = require('../middlewares/autenticacion');


let app = express();


//..............................................................
//
//..............................................................
app.get('/:tipo/:img', verificaToken, (req, res) => {

    let tipo = req.param.tipo;
    let img = req.param.img;

    let pathImagen = path.resolve(__dirname,'../../uploads/${ tipo }/${img}');
    if ( fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        let noImagePath = path.resolve(__dirname,'../assets/image.jpg');
        res.sendFile(noImagePath);
    };
});




module.exports = app;
