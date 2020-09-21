const dbProducts = require('../data/database') //requiero la base de datos de productos
const dbCategories = require('../data/db_categories');
const fs = require('fs');
const path = require('path');

module.exports = { //exporto un objeto literal con todos los metodos
    listar: function(req, res) {
        res.render('products', {
                title: "Todos los Productos",
                productos: dbProducts,
                css:"index.css",
                usuario:req.session.usuario
            }) //muestra información de prueba
    },
    detalle: function(req, res) {

        let id = req.params.id;
        let producto = dbProducts.filter(producto => {
            return producto.id == id
        })
        res.render('productDetail', {
            title: "Detalle del Producto",
            id: id,
            producto: producto[0],
            css:"product.css",
            usuario:req.session.usuario

        })
    },
    agregar:function(req,res){
        let categoria;
        let sub;
        if (req.query.categoria){
            categoria = req.query.categoria;
            sub = req.query.sub;
        }
        res.render('addProduct',{
            title:"Agregar Producto",
            categorias:dbCategories,
            categoria:categoria,
            sub:sub,
            css:"product.css",
            usuario:req.session.usuario

        })
    },
    publicar:function(req,res,next){
        let lastID = 1;
        dbProducts.forEach(producto=>{
            if(producto.id > lastID){
                lastID = producto.id
            }
        })
        let newProduct = {
            id:lastID + 1,
            name:req.body.name,
            price:Number(req.body.price),
            discount:Number(req.body.discount),
            category:req.body.category,
            description:req.body.description,
            image:(req.files[0])?req.files[0].filename:"default-image.png"
        }
        dbProducts.push(newProduct);
        
        fs.writeFileSync(path.join(__dirname,"..","data","productsDataBase.json"),JSON.stringify(dbProducts),'utf-8')

        res.redirect('/users/profile')
    },
    show:function(req,res){
        let idProducto = req.params.id;
        let flap = req.params.flap;

        let activeDetail;
        let activeEdit;
        let showDetail;
        let showEdit;

        if(flap == "show"){
            activeDetail = "active";
            showDetail = "show"
        }else{
            activeEdit = "active";
            showEdit = "show";
        } 

        let resultado = dbProducts.filter(producto=>{
            return producto.id == idProducto
        })

        res.render('productShow',{
            title: "Ver / Editar Producto",
            producto:resultado[0],
            total:dbProducts.length,
            categorias:dbCategories,
            css:"profile.css",
            activeDetail: activeDetail,
            activeEdit: activeEdit,
            showDetail:showDetail,
            showEdit:showEdit,
            usuario:req.session.usuario


        })
    },
    edit:function(req,res){
        let idProducto = req.params.id;

        dbProducts.forEach(producto => {
            if (producto.id == idProducto) {
                producto.id = Number(req.body.id);
                producto.name = req.body.name.trim();
                producto.price = Number(req.body.price);
                producto.discount = Number(req.body.discount);
                producto.category = req.body.category.trim();
                producto.description = req.body.description.trim();
                producto.image = (req.files[0]) ? req.files[0].filename : producto.image
            }
        })

        fs.writeFileSync(path.join(__dirname, '../data/productsDataBase.json'), JSON.stringify(dbProducts))
        res.redirect('/products/show/' + idProducto)

    },
    eliminar:function(req,res){
        let idProducto = req.params.id;
        dbProducts.forEach(producto=>{
            if(producto.id == idProducto){
                let aEliminar = dbProducts.indexOf(producto);
                dbProducts.splice(aEliminar,1);
            }
        })
        fs.writeFileSync(path.join(__dirname, '../data/productsDataBase.json'), JSON.stringify(dbProducts));
        res.redirect('/users/profile')
    }
}