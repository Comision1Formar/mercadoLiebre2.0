# Trabajo Práctico Integrador "MERCADO LIEBRE" by Eric
## Práctica #6 HTML+CSS

1.- Si se elige trabajar con **express-generator** chequear que esté instalado en el sistema, de lo contrario instalarlo de forma global tecleando en la **terminal** la siguiente linea:
~~~
npm install express-generator -g
~~~
_en el caso de tener linux o macOS añadir **sudo** previamente_

2.- Iniciar un nuevo proyecto de express-generator: 
~~~
express mercadoliebre -ejs 
~~~
_considerando **-ejs** como el motor de vistas a usar en nuestro proyecto_

3.- Posicionándo la **terminal** en la carpeta recién creada, instalar las dependencias:
~~~
npm install
~~~
4.- Utilizar el index.js para el proyecto, reemplazando el código existente con una nueva estructura usando el atajo del **emmet**
~~~
html:5 
~~~
5.- Cambiar el lenguaje para evitar que chrome sugiera a cada momento traducir la página
~~~
<html lang="es">
~~~
6.- linkear con **fontawesome** añadiendo la siguiente línea de código en el <**head**>:
~~~
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.min.css">
~~~
_se sugiere crear su propia cuenta en la página de_ [Font Awesome](https://fontawesome.com/start)

7.- Linkear con **bootstrap** añadiendo la siguiente línea en el <**head**>:
~~~
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">
~~~
8.- Agregar antes del cierre de la etiqueta <**body**> los script que proporciona **boostrap**
~~~
<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js" integrity="sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI" crossorigin="anonymous"></script>
~~~
_Pueden copiar estas las lineas del sitio ofical de_ [Bootstrap](https://getbootstrap.com/docs/4.5/getting-started/introduction/)

8.- Usar el archivo **style.css** que se encuentra en la carpeta **/public/stylesheets** y linkearlo al archivo **index.ejs** añadiendo la siguiente linea antes del cierre de la etiqueta <**head**>
~~~
<link rel='stylesheet' href='/stylesheets/style.css' />
~~~
_Considerar que express-generator viene configurado por defecto para acceder a la carpeta **public** por lo tanto no es necesario añadirla en la ruta_

9.- A codear...

## Practica #7 Templates Engines - EJS (Home dinámico)
1.- Crear en la carpeta public/images una nueva carpeta llamada **products**

2.- Copiar y pegar las imagenes suministradas

3.- Crear una carpeta llamada **data** y copiar el archivo json suminstrado

4.- Crear un módulo dentro de la carpeta data que se encargue de leer y parsear el json llamado **database.js** y escribir el siguiente código:

~~~
const fs = require('fs');//requiero el modulo file system
const path = require('path');//requiero el módulo path que administra las rutas de forma fiable

module.exports = JSON.parse(fs.readFileSync(path.join(__dirname, './productsDataBase.json'), 'utf-8'))`
~~~

5.- Crear la carpeta **controllers** y dentro de ella un archivo llamado **productsController.js** y escribo el siguiente código:

~~~
const path = require('path');//requiero el modulo path para el manejo de rutas
const dbProduct = require('../data/database') //requiero la base de datos de productos

module.exports = {
	listar: function(req, res) {
		res.send(dbProduct) //muestro información de prueba
    	}
    }//exporto un objeto literal con todos los metodos
~~~

6.- Creo un nuevo archivo de rutas llamado **products.js** que administrará todas las rutas relacionadas con productos y escribo el siguiente código:
~~~
const express = require('express'); //requiero express
const router = express.Router();//requiero el método Router
const controller = require('../controllers/productsController') //requiero el controlador que se hará cargo de la lógica

router.get('/', controller.listar)//construyo la ruta que me visualizará información de prueba

module.exports = router //exporto router
~~~

7.- Añado al _entry point_ **app.js** las siguientes lineas de código:
~~~
let productsRouter = require('./routes/products') //requiero el módulo enrutador que se hará cargo de la administración de las rutas relacionadas con productos

app.use('/products', productsRouter)//añado la ruta principal de productos de la cual derivarán todas las demás
~~~

8.- Creo un nuevo controllador llamado **mainController.js** que estará a cargo de la lógica del home y otras páginas que no estén relacionadas con productos ni usuarios y escribo el siguiente código:

~~~
const dbProduct = require(path.join(__dirname, '../data/database')) //requiero la base de datos de productos

module.exports = { //exporto un objeto literal con todos los metodos
    index: function(req, res) {
        res.render('index') //renderizo en el navegador la vista index que contiene el HOME del sitio
    }
}
~~~

9.- En el archivo index requiero el _controlador_ y el módulo **path** añadiendo las siguientes líneas:
~~~
let path = require('path'); //requiero path para que administre las rutas

const controller = require(path.join(__dirname, '../controllers/mainController')); //requiero el controlador para que se haga cargo de la lógica
~~~

10.- Edito y reemplazo la ruta que renderiza el home cambiando el callback por el controllador y su correspondiente método:
~~~
router.get('/', controller.index);
~~~

11.- Envío las variables necesarias en la renderización de la vista _index_ para que el **HOME** funcione correctamente dado que por defecto tiene una etiqueta EJS y además envío las variables relacionadas con productos.
~~~
index: function(req, res) {
       let ofertas = dbProduct.filter(producto => {
           return producto.category == "in-sale"
       })
       let visitadas = dbProduct.filter(producto => {
           return producto.category == "visited"
       })
       res.render('index', { //renderizo en el navegador la vista index que contiene el HOME del sitio
           title: 'Mercado Liebre', //envío el objeto literal con la o las variables necesarias para renderizar de forma correcta el home
           ofertas: ofertas,
           visitadas: visitadas
       })
   }
   ~~~
   
12.- Edito la vista **index**, elimiando las _tarjetas_ de productos estáticas y dejando solo una por cada sección
   
13.- Implemento el uso de **forEach** para recorrer el array de productos en la sección de _ultima visita_:
~~~
<!--recorro los productos basados en la ultima visita con un forEach-->
               <% visitas.forEach(producto => { %>
                   <!--caja de la grilla de bootstrap-->
                   <div class="col-12 col-md-6 col-lg-3">

                       <!--caja que muestra la información del producto-->
                       <div class="contenido">

                           <!--ETIQUETA SEMANTICA-->
                           <figure>
                               <img src="/images/products/<%- producto.image %>  " alt=" ">
                           </figure>

                           <!--informacion-->
                           <article>
                               <!--precio-->
                               <h2>$
                                   <%- producto.price %>
                               </h2>
                               <!--descuento-->
                               <span><%- producto.discount %> % OFF</span>
                               <!--nombre del producto ??-->
                               <p>
                                   <%- producto.name %>
                               </p>
                               <!--icono de envío-->
                               <i class="fas fa-truck "></i>
                           </article>
                       </div>
                       <!--finaliza contenido-->

                   </div>
                   <!--finaliza caja de grilla de boostrap-->
                   <% }) %>
~~~

14.-  Implemento el uso de **forEach** para recorrer el array de productos en la sección de _ofertas_:
~~~
<!--recorro los productos basados en la ultima visita con un forEach-->
               <% ofertas.forEach(producto => { %>
                   <!--caja de la grilla de bootstrap-->
                   <div class="col-12 col-md-6 col-lg-3">

                       <!--caja que muestra la información del producto-->
                       <div class="contenido">

                           <!--ETIQUETA SEMANTICA-->
                           <figure>
                               <img src="/images/products/<%- producto.image %>  " alt=" ">
                           </figure>

                           <!--informacion-->
                           <article>
                               <!--precio-->
                               <h2>$
                                   <%- producto.price %>
                               </h2>
                               <!--descuento-->
                               <span><%- producto.discount %> % OFF</span>
                               <!--nombre del producto ??-->
                               <p>
                                   <%- producto.name %>
                               </p>
                               <!--icono de envío-->
                               <i class="fas fa-truck "></i>
                           </article>
                       </div>
                       <!--finaliza contenido-->

                   </div>
                   <!--finaliza caja de grilla de boostrap-->
                   <% }) %>
~~~

## Practica #8 Templates Engines - EJS (Partials - Detalle del producto - Rutas parametrizadas - buscador)

1.- Crear la carpeta partials dentro de la carpeta views

2.- Crear tres archivos dentro de carpeta partials: 'head.ejs', 'header.ejs' y 'footer.ejs'

3.- Mover las porciones de código correspondientes desde el archivo index.ejs a cada uno de los partials, reemplazando vinculando el código migrado por las siguientes líneas de código respectivamente:

~~~
<%- include('partials/head') %>
<%- include('partials/header') %>
<%- include('partials/footer') %>
~~~

4.- Crear un carpeta llamada **functions**, y dentro de ella un archivo **agregaMiles** que contenga una función que permita añadir el formato de 'miles' al precio (product.price). **LUEGO SE USA DIRECTAMENTE EN LA VISTA**

~~~
module.exports = number => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
~~~

5.- Agregar el siguiene condicional en index.ejs para el caso que el producto no tenga descuento:
~~~
    <% if (producto.discount != 0) { %>
        <span><%- producto.discount %> % OFF</span>
    <% } %>
~~~

6.- Crear el archivo **productDetail.ejs**. Añadir los _partials_ y crear la estructura necesaria para mostrar el detalle del producto conforme al modelo.

7.- Crear el método correspondiente al controlador _productController_ que renderize la página _productDetail_:

~~~
 detalle: function(req, res) {
        id = req.params.id;
        res.render('productDetail', {
            title: "Detalle del Producto",
            id: id,
        })
    }
~~~

8.- Crear la ruta correspondiente en el enrutador _product_:

~~~
router.get('/detail/:id', controller.detalle) // añado la ruta para mostrar los detalles del producto
~~~

9.- Añadir en el _index.ejs_ las rutas necesarias para que se renderice la vista de _productDetail_

10.- Dar funcionalidad al buscador. En el header el formulario de búsqueda debe quedar así:

~~~
    <form action="/search" method="get" class="search-form">
        <input type="text" name="search" placeholder="Buscar productos, marcas y más" class="search-form_input">
        <button type="submit" class="search-form_button"><i class="fas fa-search"></i></button>
    </form>
~~~

11.- Crear la vista llamada **products** para mostrar los productos, tomando como referencia una sección del home, con su correspondiente _forEach_

12.- Modificar el método _listar_ del _productController_ para que en la vista _products_ se muestren todos los productos:

~~~
 listar: function(req, res) {
        res.render('products', {
                title: "Todos los Productos",
                productos: dbProducts
            }) //muestra información de los productos
    },
~~~

13.- Agregar el método llamado **search** en el controlador _productsController_ que hará la lógica para buscar productos:

~~~
search: function(req, res) {
        let buscar = req.query.search;
        let productos = [];
        dbProducts.forEach(producto => {
            if (producto.name.toLowerCase().includes(buscar)) {
                productos.push(producto)
            }
        })
        res.render('products', {
            title: "Resultado de la búsqueda",
            productos: productos
        })
    },
~~~

14.- Agregar en el _head_ todos los link generados en la página [https://www.favicon-generator.org/](https://www.favicon-generator.org/)

~~~
    <link rel="apple-touch-icon" sizes="57x57" href="/images/favicon/apple-icon-57x57.png">
    <link rel="apple-touch-icon" sizes="60x60" href="/images/favicon/apple-icon-60x60.png">
    <link rel="apple-touch-icon" sizes="72x72" href="/images/favicon/apple-icon-72x72.png">
    <link rel="apple-touch-icon" sizes="76x76" href="/images/favicon/apple-icon-76x76.png">
    <link rel="apple-touch-icon" sizes="114x114" href="/images/favicon/apple-icon-114x114.png">
    <link rel="apple-touch-icon" sizes="120x120" href="/images/favicon/apple-icon-120x120.png">
    <link rel="apple-touch-icon" sizes="144x144" href="/images/favicon/apple-icon-144x144.png">
    <link rel="apple-touch-icon" sizes="152x152" href="/images/favicon/apple-icon-152x152.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/images/favicon/apple-icon-180x180.png">
    <link rel="icon" type="image/png" sizes="192x192" href="/images/favicon/android-icon-192x192.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="96x96" href="/images/favicon/favicon-96x96.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon/favicon-16x16.png">
    <link rel="manifest" href="/images/favicon/manifest.json">
    <meta name="msapplication-TileColor" content="#ffffff">
    <meta name="msapplication-TileImage" content="/images/favicon/ms-icon-144x144.png">
    <meta name="theme-color" content="#ffffff">
~~~

15.- Copiar las imagenes generadas por la pagina _https://www.favicon-generator.org/_ en la carpeta **/public/images/favicon**