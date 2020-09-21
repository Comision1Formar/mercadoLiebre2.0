var express = require('express');
var router = express.Router();
const controller = require('../controllers/usersController');
const sessionUserCheck = require('../middlewares/sessionUserCheck');

const upImageAvatar = require('../middlewares/upImageAvatar');

const registerValidator = require('../validations/registerValidator');
const loginValidator = require('../validations/loginValidator');

router.get('/register',controller.register);
router.post('/register',upImageAvatar.any(),registerValidator, controller.processRegister);

router.get('/login',controller.login);
router.post('/login',loginValidator,controller.processLogin);

router.get('/profile', controller.profile);
router.put('/updateProfile/:id',upImageAvatar.any(),controller.updateProfile);
router.delete('/delete/:id',controller.delete);

router.get('/logout',controller.logout);

module.exports = router;
