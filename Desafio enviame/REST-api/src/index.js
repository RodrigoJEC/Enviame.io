const express = require('express');                         //Este odulo permite iniciar el servior.
const app = express();                                      //Ejecuta el modulo y lo guarda en constante app.


// middlewares                                              Funciones que se ejecutan antes de llegar a las rutas
app.use(express.json());                                    //Permite al servidor interpretar datos en formato json.
app.use(express.urlencoded({extended: false}));             //solo acepta datos simples a traves de un formulario.


// routes
app.use(require('./routes/index'));                         //App quiero que utilize lo que voy a requerir desde la carpeta route en el archivo index.



app.listen(4000);                                           //Escucha en el puerto 4000.
console.log('server en puerto 4000')