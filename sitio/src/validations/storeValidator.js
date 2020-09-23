const {check,validatorResult,body} = require('express-validator');

module.exports = [

    check('nameStore')
    .isLength({
        min:1
    })
    .withMessage('Debes ingresar el nombre de la tienda'),

    body('logo')
    .custom((value,{req}) => {
        if(req.fileValidatorError){
            return false
        }else{
            return true
        }
    })
    .withMessage("Solo se permiten png, jpg, jpeg, gif")
]