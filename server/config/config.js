// PUERTO 
process.env.PORT = process.env.PORT || 3000;

//---------------------------------------
// Entorno Desa o Produccion
//---------------------------------------

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// base de datos
let urlDB;


if (process.env.NODE_ENV === 'dev') {
    urlDB =  'mongodb://localhost:27017/cafe';
} else {
    urlDB =  process.env.MONGODB_URI;
}
//urlDB =  'mongodb+srv://admin:3uKu6fJnt2m1yjlg@cluster0-lh7um.mongodb.net/test?retryWrites=true&w=majority';

process.env.URLDB = urlDB;


