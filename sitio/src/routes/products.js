const express = require('express'); //requiero express
const router = express.Router(); //requiero el método Router

const upImageProducto = require('../middlewares/upImageProducto');
const sessionUserCheck = require('../middlewares/sessionUserCheck');


const controller = require('../controllers/productsController') //requiero el controlador que se hará cargo de la lógica

router.get('/', controller.listar) //construyo la ruta que me visualizará información de prueba
router.get('/detail/:id', controller.detalle) // añado la ruta para mostrar los detalles del producto

router.get('/add',sessionUserCheck,controller.agregar);
router.get('/add/form',sessionUserCheck,controller.agregar);
router.post('/add/form',upImageProducto.any(), controller.publicar);

router.get('/show/:id/:flap?',sessionUserCheck,controller.show);
router.put('/edit/:id/:flap?',upImageProducto.any(),controller.edit);
router.delete('/delete/:id',controller.eliminar);




module.exports = router //exporto router