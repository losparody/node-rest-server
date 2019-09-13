require('./config/config');

const express = require('express');
const mongoose = require('mongoose');

const app = express();
const bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(require('./routes/usuario'));


    
// conexion a base de datos
mongoose.connect(process.env.URLDB ,{ useNewUrlParser: true , useCreateIndex:true, useUnifiedTopology: true }, (err,res) => {
    if (err) throw err;
    console.log('Base de Datos levantada');
})

app.listen(process.env.PORT , () => {
    console.log('Escuchando en puerto',process.env.PORT);
});

//
// export AWS_ACCESS_KEY_ID=ASIASZY6MNOXQPB44KDX
// export AWS_SECRET_ACCESS_KEY=6OtqGO92rrsKKMDU6AFnl/61AO83TIgworZFzXnE
// export AWS_SESSION_TOKEN=FQoGZXIvYXdzEJ7//////////wEaDOuFdsmOj8PH/R/rPCLuAaOIgDyxEMSO9JMoR0ltNei5YJH8VAxWmlXeM8KXfqxJ+9m+22b6boDtZMDJnSzQhVxHPECRdWcxtyAlVsAk4oWlgWpsIhtmtJYGp3jHesdGTJntjCcw+p+K8dORZfdzRV+KoYHOEikulK6nsq8JwApXC2BGnoxWM0hCsU8UC7bYBrAE8ZkBSe2cwPvcXZKCbzEuyJdEXep15DUL7/AdD5WO4rJvtI9fjnK199QVjaWAcRyS7aIzoe7EyfyxlBEojik4TbjnOEdT8j0cIolV9im3QhfsxfPHvo6vF/g1WBBAlTieSx294JWZkUd6wi0ozIbE6wU=
// export AWS_DEFAULT_REGION=us-east-1