const {check,validatorResult,body} = require('express-validator');
const dbUsuarios = require('../data/dbUsuarios');

const db = require('../database/models');

module.exports = [
    check('nombre')
    .isLength({
        min:1
    })
    .withMessage('Debes ingresar un nombre válido'),
    
    check('apellido')
    .isLength({
        min:1
    })
    .withMessage('Debes ingresar un apellido válido'),
    
    body('email')
    .custom(function(value){
        console.log(value)

        return db.Users.findOne({
            where:{
                email:value
            }
        })
        .then(user => {
            if(user){
                return Promise.reject('Este email ya está registrado')
            }
        })
    }),

    check('email')
    .isEmail()
    .withMessage('Debes ingresar un email válido'),

    check('pass')
    .notEmpty()
    .withMessage('Debes ingresar una contraseña'),

    check('pass')
    .isLength({
        min:6,
        max:12
    })
    .withMessage('La contraseña debe tener entre 6 y 12 caracteres'),

    body('pass2')
    .custom(function(value,{req}){
        if(value != req.body.pass){
            return false
        }
        return true
    })
    .withMessage('Las contraseñas no coinciden')
]