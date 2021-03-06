let dbProductos = require('../data/database');
let dbUsuarios = require('../data/dbUsuarios');

const db = require('../database/models');

const {validationResult} = require('express-validator');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

module.exports = {
    register:function(req,res){
        console.log(req.session.store)
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
            rol:(req.session.store)?req.session.store:"user"
        })
        .then(result => {
            console.log(result)
            if(req.session.store){
                req.session.store = result;
                return res.redirect('/stores/register')
            }
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
        
        if(req.session.user){
            db.Users.findByPk(req.session.user.id)
            .then(user => {
                console.log(user)
                res.render('userProfile', {
                    title: "Perfil de usuario",
                    css:"profile.css",
                    usuario:user,
                    productos: dbProductos.filter(producto => {
                        return producto.category != "visited" & producto.category != "in-sale"
                    })
                })
            })
        }else{
            res.redirect('/')
        }
    },
    updateProfile: function(req,res){
        db.Users.update(
            {
                fecha:req.body.fecha,
                avatar:(req.files[0])?req.files[0].filename:req.session.user.avatar,
                direccion:req.body.direccion.trim(),
                ciudad:req.body.ciudad.trim(),
                provincia:req.body.provincia.trim()
            },
            {
                where:{
                    id:req.params.id
                }
            }
        )
        .then(result => {
             res.redirect('/users/profile')
        })
        .catch(err => {
            console.log(err)
        })
    },
    logout:function(req,res){
        req.session.destroy();
        if(req.cookies.userMercadoLiebre){
            res.cookie('userMercadoLiebre','',{maxAge:-1})
        }
        return res.redirect('/')
    },
    delete:function(req,res){
        if(fs.existsSync(path.join(__dirname,'../../public/images/users'+req.session.user.avatar))){
            fs.unlinkSync(path.join(__dirname,'../../public/images/users'+req.session.user.avatar))
        }
        req.session.destroy();
        if(req.cookies.userMercadoLiebre){
            res.cookie('userMercadoLiebre','',{maxAge:-1})
        }
        db.Users.destroy({
            where:{
                id:req.params.id
            }
        })
        .then(result => {
            res.redirect('/')
        })
        .catch(err => {
            console.log(err)
        })
    }
}