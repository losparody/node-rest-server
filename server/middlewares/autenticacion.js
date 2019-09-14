const jwt = require('jsonwebtoken');

let verificaToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.TOKEN_SEED, (err,decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {message: 'El token no es valido'}
            })
        }
        req.usuario = decoded.usuario;
        next();
    });

    res.json({
        token: token
    })
}

let verificaAdminRole = (req, res, next) => {

    let usuario = req.body.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false , 
            err: {
                message: 'El usuario no es ADMINISTRADOR'
            }
        }) 
    }

    
    
}



module.exports = {
    verificaToken,
    verificaAdminRole
};