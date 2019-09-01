require('./config/config');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');


 
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const port = process.port || 3000;
 


// urls
app.get('/', function (req, res) {
  res.json('Hello World');
})

app.get('/usuario', function (req, res) {
    res.json('getusuarios');
})

app.post('/usuario', function (req, res) {
    
    let body = req.body;

    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario'
        })
    } else{
        res.json(
            {
                persona: body
            }
        )
    }
  
    
})

app.put('/usuario/:id', function (req, res) {
    let id = req.params.id;
    res.json({
        id
    });
})

app.delete('/', function (req, res) {
    res.send('delete  usuarios');
})
    

app.listen(process.env.PORT , () => {
    console.log('Escuchando en puerto',process.env.PORT);
});
