let dbProductos = require('../data/database');
let dbUsuarios = require('../data/dbUsuarios');

const db = require('../database/models');

const {validationResult} = require('express-validator');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

module.exports = {
    register:function(req,res){
        res.render('userRegister',{
            title:"Registro de Usuario",
            css: "index.css"
        })
    },
    processRegister:function(req,res){
       let errors = validationResult(req);
       
       if(errors.isEmpty()){
         
        db.Users.create({
            nombre:req.body.nombre.trim(),
            apellido:req.body.apellido.trim(),
            email:req.body.email.trim(),
            password:bcrypt.hashSync(req.body.pass.trim(),10),
            avatar:(req.files[0])?req.files[0].filename:"default.png",
            rol:"user"
        })
        .then(result => {
            console.log(result)
            return res.redirect('/users/login')
        })
        .catch(errores => {
            console.log(errores)
            return res.redirect('/users/register')
        })

       }else{
            res.render('userRegister',{
            title:"Registro de Usuario",
            css: "index.css",
            errors:errors.mapped(),
            old:req.body
           })
       }
    },
    login:function(req,res){
        res.render('userLogin',{
            title:"Ingresá a tu cuenta",
            css: "index.css",
            usuario:req.session.usuario
        })
    },
    processLogin:function(req,res){
        let errors = validationResult(req);
        if(errors.isEmpty()){
           
            db.Users.findOne({
                where:{
                    email:req.body.email
                }
            })
            .then(user => {
                req.session.user = {
                    id: user.id,
                    nick: user.nombre + " " + user.apellido,
                    email: user.email,
                    avatar: user.avatar,
                    rol: user.rol
                }
                if(req.body.recordar){
                    res.cookie('userMercadoLiebre',req.session.user,{maxAge:1000*60*2})
                }
                res.locals.user = req.session.user;

                return res.redirect('/')
            })
        }else{
            res.render('userLogin',{
                title:"Ingresá a tu cuenta",
                css: "index.css",
                errors:errors.mapped(),
                old:req.body
            })
        }
    },
    profile:function(req,res){
        res.render('userProfile',{
            title: "Perfil de usuario",
            productos:dbProductos.filter(producto=>{
                return producto.category != "visited" && producto.category != "in-sale"
            }),
            css:"profile.css",
            usuario:req.session.user

        })
    },
    updateProfile: function(req,res){
        
    },
    logout:function(req,res){
        req.session.destroy();
        if(req.cookies.userMercadoLiebre){
            res.cookie('userMercadoLiebre','',{maxAge:-1})
        }
        return res.redirect('/')
    },
    delete:function(req,res){

    }
}