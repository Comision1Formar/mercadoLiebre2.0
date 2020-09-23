var express = require('express');
var router = express.Router();
const controller = require('../controllers/storeController');

const upImagesLogo = require('../middlewares/upImagesLogo');
const storeValidation = require('../validations/storeValidator')

router.get('/preRegister',controller.preRegister);
router.get('/register',controller.register);
router.post('/register',upImagesLogo.any(),storeValidation,controller.processRegister)

module.exports = router;