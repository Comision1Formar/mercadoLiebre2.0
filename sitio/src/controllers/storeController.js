const db = require('../database/models');

const {validationResult} = require('express-validator');

module.exports = {
    preRegister:function(req,res){
        req.session.store = "store"
        res.redirect('/users/register')
    },
    register:function(req,res){
        res.render('storeRegister',{
            title:"Registro de Tienda",
            css:"index.css",
            usuario:req.session.store
        })
    },
    processRegister:function(req,res){
        let errors = validationResult(req);
        if(errors.isEmpty()){
            db.Stores.create({
                nombre:req.body.nameStore.trim(),
                imagen:(req.files[0])?req.files[0].filename:"store.jpg",
                id_usuario:req.session.store.id
            })
            .then( result => {
                console.log(result)
                req.session.destroy()
                return res.redirect('/users/login')
            })
            .catch(errors =>{
                console.log()
            })
        }else{
            res.render('storeRegister',{
                title:"Registro de Tienda",
                css:"index.css",
                usuario:req.session.store,
                errors:errors.mapped(),
                old:req.body
            })
        }
    }
}