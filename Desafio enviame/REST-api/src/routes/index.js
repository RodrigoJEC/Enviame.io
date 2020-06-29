// En este archivo se definen las rutas o url que tendra el servidor
const {Router} = require('express');                                      //Exporto funcion Router desde el modulo express.
const router = Router();                                                  //Al ejecutar regresa un objeto que permite definir las rutas o url.


const {getEnvio,generar,getEnviosByID,deleteEnvio,updatereg,putdistancia,tiempo} = require('../controllers/index.controller')

router.post('/guardar',generar);
router.get('/envios',getEnvio);
router.get('/envios/:id',getEnviosByID);
router.get('/tiempo/:id',tiempo);
router.put('/envios/:id',updatereg);
router.put('/distancia',putdistancia);
router.delete('/delete/:id',deleteEnvio);



module.exports = router;